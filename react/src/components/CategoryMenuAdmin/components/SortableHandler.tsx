import React from 'react';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <DragHandleIcon></DragHandleIcon>);

export default DragHandle;
