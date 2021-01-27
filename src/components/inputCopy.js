import React, { useRef, useCallback, useState } from 'react';
import { ControlGroup, InputGroup, Button, Tooltip } from '@blueprintjs/core';

const InputCopy = ({ defaultValue, value, size, fill, small }) => {
  const eventRef = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const selectAll = useCallback(() => {
    let eventIdRefCurrent = eventRef.current;
    eventIdRefCurrent.select();
  }, [eventRef])
  const copyToClipboard = useCallback((e) => {
    selectAll();
    document.execCommand('copy');
    e.target.focus();
    setIsClicked(true);
  }, [selectAll]);
  return (
    <ControlGroup>
      <InputGroup 
        readOnly
        small={small}
        fill={fill}
        inputRef={eventRef}
        size={size}
        onClick={selectAll}
        defaultValue={defaultValue}
        value={value} />
      <Tooltip
        usePortal={false}
        isOpen={isClicked}
        position="left"
        content={"Copied!"}>
        <Button small={small}
          icon="clipboard"
          onClick={copyToClipboard}
          onMouseLeave={() => {
            setIsClicked(false);
          }} />
      </Tooltip>
    </ControlGroup>
  )
}

export default InputCopy;