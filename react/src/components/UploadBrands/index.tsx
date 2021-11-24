import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { useIntl } from 'react-intl';
import { messages } from '../../../src/messages';
import {
  BrandsItemType,
  BrandsType,
  ID,
  IDialogStateBrands,
  ShowToastParams,
  VtexBlock
} from '../../../src/shared';
import UploadBrandsMutation from '../../graphql/mutations/UploadBrandsMutation.graphql';
import ValidateDisponibilityMutation from '../../graphql/mutations/ValidateDisponibilityMutation.graphql';
import PageBrands from './Page';
import * as XLSX from 'xlsx';
import { UploadMarksFormat } from '../../shared/files/uploadMarks';
interface Props {
  showToast: (params: ShowToastParams) => void;
}

const UploadBrands = (props: Props) => {
  const { showToast } = props;
  const intl = useIntl();
  // Mutation data to UploadBrandsMutation
  const [uploadBrandsMutation, uploadBrandsMutationState] = useMutation(UploadBrandsMutation);
  const [validateDisponibility, validateDisponibilityState] = useMutation(ValidateDisponibilityMutation);
  const [files, setFiles] = useState(null);
  const [haveDuplicates, setHaveDuplicates] = useState(false);
  const [marksList, setMarksList] = useState<BrandsItemType[]>([]);
  const [mutationBrandResponse, setMutationBrandResponse] = useState<BrandsItemType[]>([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finishLoad, setFinishLoad] = useState(false);
  const [errorOnReadFile, setErrorOnReadFile] = useState(false);
  const [isMakeTheValidation, setIsMakeTheValidation] = useState(false);
  const downloadUrl = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ marks: UploadMarksFormat })
  )}`;
  const downloadUrlXls =
    'https://vtex-mkp-resources.s3.amazonaws.com/content/brands/example/marks-upload-format.xls';

  const [downloadMarksList, setDownloadMarksList] = useState<BrandsItemType[]>([]);
  const [dialogState, setDialogState] = useState<IDialogStateBrands>({
    open: false,
    message: '',
    action: ''
  });

  const [blockVariation, setBlockVariation] = useState<VtexBlock>('full');

  useEffect(() => {
    setDownloadMarksList(removeConfiguration(marksList));
  }, [marksList]);

  useEffect(() => {
    if (!validateDisponibilityState.loading) {
      if (validateDisponibilityState.data) {
        const { message, data, numberOfDuplicates } = validateDisponibilityState.data.validateDisponibility;
        if (data && data.brands) {
          setDuplicateResponse(data.brands);
          if (numberOfDuplicates > 0) {
            setHaveDuplicates(true);
            setIsMakeTheValidation(true);
            showToast({
              message: `${numberOfDuplicates} ${intl.formatMessage(messages.brandsDuplicateAlert)}`,
              duration: 3000
            });
          } else {
            setHaveDuplicates(false);
            setIsMakeTheValidation(true);
            showToast({
              message: `${numberOfDuplicates} ${intl.formatMessage(messages.brandsDuplicateAlert)}`,
              duration: 3000
            });
          }
        } else {
          showToast({ message, duration: 3000 });

          setHaveDuplicates(false);
        }
      }
    }
  }, [validateDisponibilityState]);

  useEffect(() => {
    if (!uploadBrandsMutationState.loading) {
      if (uploadBrandsMutationState.data) {
        const { message, data } = uploadBrandsMutationState.data.createBrands;
        if (data && data.brands) {
          setBlockVariation('aside');
          setMutationBrandResponse(data.brands);
          setMarksList([]);
          setResult(null);
          setIsLoading(false);
          showToast({ message, duration: 3000 });
          setFinishLoad(true);
        } else {
          setIsLoading(false);
          showToast({ message, duration: 3000 });
        }
      }
    }
  }, [uploadBrandsMutationState]);

  const validateDuplicates = async () => {
    const marksToUpload = removeConfiguration(marksList);
    validateDisponibility({ variables: { data: marksToUpload } });
  };

  const saveBrands = () => {
    setIsLoading(true);
    const marksToUpload = removeConfiguration(marksList);
    uploadBrandsMutation({ variables: { data: marksToUpload } });
  };

  const setDuplicateResponse = (brands: BrandsType[]) => {
    const marks = Object.assign({}, marksList);
    const result = _.map(marks, function (o, _i) {
      const eq = _.find(brands, function (e, _ind) {
        return o.name.toLowerCase() === e.name.toLowerCase();
      });
      o.isDuplicate = eq ? eq.isDuplicate : false;
      return o;
    });

    // Validate local duplicates
    result.map((item) => {
      const filter = result.filter((itemFilter) => itemFilter.name.toLowerCase() === item.name.toLowerCase());
      if (filter.length >= 2) {
        item.isDuplicate = true;
      }
    });
    setMarksList(result);
  };

  const removeConfiguration = (marksList: BrandsItemType[]) => {
    const marksToUpload: BrandsItemType[] = JSON.parse(JSON.stringify(marksList));
    marksToUpload.map((item: any) => {
      delete item.id;
      delete item.isDuplicate;
      return true;
    });

    return marksToUpload;
  };

  const readXls = (files: any) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onloadend = (e: any) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: 'array' });
      let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      setReaderFile(XL_row_object);
    };
  };

  const readJson = (files: any) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const text: any = reader.result;
      if (JSON.parse(text).marks) {
        setReaderFile(JSON.parse(text).marks);
      }
    };
    reader.readAsText(files[0]);
  };

  const setReaderFile = (marksToUse: any) => {
    if (marksToUse && marksToUse.length) {
      const marks = marksToUse.map((item: any) => {
        const o = Object.assign({}, item);
        o.id = ID();
        o.isDuplicate = false;
        o.menuHome = Boolean(o.menuHome);
        o.active = Boolean(o.active);
        return o;
      });
      setErrorOnReadFile(false);
      setMarksList(marks);
    } else {
      setErrorOnReadFile(true);
    }
  };

  // Capture the file content
  const handleFile = (files: any) => {
    if (files && files.length) {
      if (files[0] && files[0].path.includes('xls')) {
        readXls(files);
      } else if (files[0] && files[0].path.includes('json')) {
        readJson(files);
      } else {
        handleReset();
        setErrorOnReadFile(true);
      }
    }
    setResult(files);
  };

  // Clear the current information
  const handleReset = () => {
    console.debug(files);
    setResult(null);
    setFiles(null);
    setIsLoading(false);
    setMarksList([]);
    setHaveDuplicates(false);
    setIsMakeTheValidation(false);
    setBlockVariation('full');
    setMutationBrandResponse([]);
    setFinishLoad(false);
    setErrorOnReadFile(false);
  };

  const removeDuplicates = () => {
    setIsLoading(true);
    const marks = Object.assign([], marksList);
    let filters = _.filter(marks, function (item: any) {
      return !item.isDuplicate;
    });

    setHaveDuplicates(false);
    setIsLoading(false);
    showToast({
      message: intl.formatMessage(messages.duplicateElementsRemove),
      duration: 3000
    });
    setMarksList(filters);
  };

  const removeElement = (id: string) => {
    const marks = Object.assign({}, marksList);
    const filers = _.filter(marks, function (item) {
      return item.id !== id;
    });
    setMarksList(filers);
  };

  const onAddBrand = (brand: BrandsItemType) => {
    if (!isLoading) {
      const markCopy = Object.assign({}, brand);
      markCopy.id = ID();
      markCopy.isDuplicate = false;
      const marksL = Object.assign([], marksList);
      marksL.push(markCopy);
      setMarksList(marksL);
      setIsMakeTheValidation(false);
    }
  };

  const onUpdateBrand = (brand: BrandsItemType) => {
    if (!isLoading) {
      const index = _.findIndex(marksList, { id: brand.id });
      // Replace item at index using native splice
      marksList.splice(index, 1, brand);
      setMarksList(Object.assign([{}], marksList));
      setIsMakeTheValidation(false);
    }
  };

  return (
    <PageBrands
      {...{
        showToast,
        intl,
        dialogState,
        onAddBrand,
        haveDuplicates,
        finishLoad,
        isMakeTheValidation,
        onUpdateBrand,
        setDialogState,
        errorOnReadFile,
        removeElement,
        removeDuplicates,
        handleReset,
        handleFile,
        validateDuplicates,
        saveBrands,
        blockVariation,
        downloadMarksList,
        mutationBrandResponse,
        result,
        downloadUrl,
        downloadUrlXls,
        isLoading,
        marksList
      }}
    />
  );
};

export default UploadBrands;
