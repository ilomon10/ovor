import React, { useRef, useCallback } from 'react';
import { ControlGroup, InputGroup, Button, Tooltip } from '@blueprintjs/core';

const InputCopy = ({ defaultValue, size, fill, small }) => {
  const eventRef = useRef();
  const selectAll = useCallback(() => {
    let eventIdRefCurrent = eventRef.current;
    eventIdRefCurrent.select();
  }, [eventRef])
  const copyToClipboard = useCallback((e) => {
    selectAll();
    document.execCommand('copy');
    e.target.focus();
  }, [selectAll]);
  return (
    <ControlGroup>
      <InputGroup readOnly
        small={small}
        fill={fill}
        inputRef={eventRef}
        size={size}
        onClick={selectAll}
        defaultValue={defaultValue} />
      <Tooltip
        content={"Copy"}>
        <Button small={small}
          icon="clipboard" onClick={copyToClipboard} />
      </Tooltip>
    </ControlGroup>
  )
}

export default InputCopy;