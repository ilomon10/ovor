import { useState, useCallback } from 'react';

const Draggable = ({
  children
}) => {
  const [isDrag, setIsDrag] = useState(false);
  const onDragEndHandler = useCallback((e) => {
    setIsDrag(false);
  }, []);
  const onMouseDownHandler = useCallback((e) => {
    setIsDrag(true);
  }, []);
  const onMouseUpHandler = useCallback((e) => {
    setIsDrag(false);
  }, []);
  return children({
    isDrag,
    onDragEndHandler,
    onMouseDownHandler,
    onMouseUpHandler
  });
}

export default Draggable;