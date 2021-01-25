import React, { useCallback } from 'react';
import { useField } from "formik";
import { Colors } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import { Box } from 'components/utility/grid';
import { toBase64 } from "components/helper";
import AspectRatio from 'components/aspectratio';

const FileInput = ({ name, value }) => {
  const field = useField({ name });
  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    field[2].setValue(base64);
    field[2].setTouched(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box width={150}>
      <AspectRatio ratio="1:1" style={{ backgroundColor: Colors.LIGHT_GRAY2, borderRadius: 4 }}>
        {value &&
          <img alt="name" src={value} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />}
        <Dropzone
          onDrop={onDrop}
          maxSize={524288}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Box {...getRootProps({
              style: {
                height: "100%", width: "100%",
                position: "absolute", top: 0, left: 0,
                borderRadius: 4
              }
            })}>
              <input {...getInputProps()} />
              <Box
                bg="white"
                py={1} px={1}
                style={{
                  whiteSpace: "nowrap",
                  border: `1px solid ${Colors.GRAY5}`,
                  borderRadius: 4,
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)"
                }}>
                {isDragActive ?
                  <div>Drop Here...</div> :
                  <div>Drop Image</div>}
              </Box>
            </Box>
          )}
        </Dropzone>
      </AspectRatio>
    </Box>
  )
}

export default FileInput;