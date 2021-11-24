export const stopPropagation = (e: any) => {
  e.stopPropagation();
  e.preventDefault();
};

export var ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export const exportToJson = (objectData: any, fileName: string) => {
  console.debug(objectData);
  let filename = fileName;
  let contentType = 'application/json;charset=utf-8;';
  var a = document.createElement('a');
  a.download = filename;
  a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
