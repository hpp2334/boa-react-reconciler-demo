const { useState, useEffect, useRef } = React;

function PaddingAll(props) {
  return (
    <padding
      top={props.value}
      bottom={props.value}
      left={props.value}
      right={props.value}
    >
      {props.children}
    </padding>
  );
}

function Button(props) {
  return (
    <row backgroundColor={props.backgroundColor || "gray"} onClick={props.onClick} testId={props.testId}>
      <PaddingAll value={8}>
        <row gap={4}>
          <text text={props.prefix} />
          <text text={props.text} />
        </row>
      </PaddingAll>
    </row>
  );
}

function ControlPanel({ animationState, onAnimationToggle, onSpeedChange, onColorChange }) {
  return (
    <column gap={8} width="300px" backgroundColor="lightgray" padding={12}>
      <text text="Breathing Box Controls" fontSize={18} />

      <row gap={8} mainAlignment="center">
        <Button
          prefix={animationState.isPlaying ? "⏸" : "▶"}
          text={animationState.isPlaying ? "Pause" : "Play"}
          onClick={onAnimationToggle}
          backgroundColor={animationState.isPlaying ? "orange" : "green"}
          testId="btn-play-pause"
        />
        <Button
          prefix="🔄"
          text="Reset"
          onClick={() => onAnimationToggle(false)}
          backgroundColor="blue"
          testId="btn-reset"
        />
      </row>

      <column gap={4}>
        <text text={`Speed: ${animationState.speed}ms`} fontSize={14} />
        <row gap={4}>
          <Button text="Slower" onClick={() => onSpeedChange(Math.min(1000, animationState.speed + 50))} />
          <Button text="Faster" onClick={() => onSpeedChange(Math.max(50, animationState.speed - 50))} />
        </row>
      </column>

      <column gap={4}>
        <text text="Box Color" fontSize={14} />
        <row gap={4}>
          {['red', 'blue', 'green', 'purple', 'orange', 'pink'].map((color) => (
            <row
              key={color}
              width={30}
              height={30}
              backgroundColor={color}
              onClick={() => onColorChange(color)}
              testId={`color-${color}`}
              border={animationState.color === color ? '3px solid black' : 'none'}
            />
          ))}
        </row>
      </column>

      <column gap={4}>
        <text text={`Min Size: ${animationState.minSize}px`} fontSize={12} />
        <text text={`Max Size: ${animationState.maxSize}px`} fontSize={12} />
        <text text={`Current Size: ${Math.round(animationState.currentSize)}px`} fontSize={12} color="blue" />
      </column>
    </column>
  );
}

function BreathingBox({ size, color, isPlaying }) {
  return (
    <column
      width="400px"
      height="400px"
      backgroundColor="white"
      border="2px solid #333"
      mainAlignment="center"
      crossAlignment="center"
      testId="animation-canvas"
    >
      <column
        width={`${size}px`}
        height={`${size}px`}
        backgroundColor={color}
        mainAlignment="center"
        crossAlignment="center"
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'all 0.1s ease-in-out'
        }}
        testId="breathing-box"
      >
        <text text={`${Math.round(size)}`} fontSize={16} color="white" />
      </column>
    </column>
  );
}

function AnimationDemo() {
  const [animationState, setAnimationState] = useState({
    isPlaying: false,
    speed: 100,
    color: 'blue',
    currentSize: 50,
    minSize: 20,
    maxSize: 150,
    growing: true
  });

  const animationTimeoutRef = useRef(null);

  const animateBox = () => {
    setAnimationState(prevState => {
      let newSize = prevState.currentSize;
      let newGrowing = prevState.growing;

      // Calculate size change based on direction
      if (prevState.growing) {
        newSize = prevState.currentSize + 2;
        if (newSize >= prevState.maxSize) {
          newSize = prevState.maxSize;
          newGrowing = false; // Start shrinking
        }
      } else {
        newSize = prevState.currentSize - 2;
        if (newSize <= prevState.minSize) {
          newSize = prevState.minSize;
          newGrowing = true; // Start growing again
        }
      }

      return {
        ...prevState,
        currentSize: newSize,
        growing: newGrowing
      };
    });

    // Schedule next frame - simulate setInterval with setTimeout
    animationTimeoutRef.current = setTimeout(animateBox, animationState.speed);
  };

  const startAnimation = () => {
    // Start the breathing animation using setTimeout
    animationTimeoutRef.current = setTimeout(animateBox, animationState.speed);
  };

  const stopAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  const handleAnimationToggle = (forcePlay = null) => {
    const shouldPlay = forcePlay !== null ? forcePlay : !animationState.isPlaying;

    setAnimationState(prev => ({
      ...prev,
      isPlaying: shouldPlay
    }));

    if (shouldPlay) {
      startAnimation();
    } else {
      stopAnimation();
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setAnimationState(prev => ({
      ...prev,
      speed: newSpeed
    }));

    // Restart animation with new speed if currently playing
    if (animationState.isPlaying) {
      stopAnimation();
      animationTimeoutRef.current = setTimeout(animateBox, newSpeed);
    }
  };

  const handleColorChange = (newColor) => {
    setAnimationState(prev => ({
      ...prev,
      color: newColor
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <column width="100%" mainAlignment="center" gap={12}>
      <text text="Breathing Box Animation" fontSize={28} color="darkblue" />

      <text text="Watch the box breathe - growing bigger, then smaller, forever!" fontSize={14} color="gray" />

      <row gap={16} mainAlignment="center">
        <ControlPanel
          animationState={animationState}
          onAnimationToggle={handleAnimationToggle}
          onSpeedChange={handleSpeedChange}
          onColorChange={handleColorChange}
        />

        <BreathingBox
          size={animationState.currentSize}
          color={animationState.color}
          isPlaying={animationState.isPlaying}
        />
      </row>

      <row gap={8} mainAlignment="center">
        <text text={`Animation: ${animationState.isPlaying ? 'Running' : 'Stopped'}`} fontSize={14} testId="animation-status" />
        <text text={`Direction: ${animationState.growing ? 'Growing ➡️' : 'Shrinking ⬅️'}`} fontSize={14} testId="direction-status" />
      </row>
    </column>
  );
}

function App() {
  return <AnimationDemo />;
}