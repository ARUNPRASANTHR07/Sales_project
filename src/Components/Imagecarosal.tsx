import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MobileStepper from "@mui/material/MobileStepper";

interface ImageCarouselProps {
  images: { src: string; alt?: string; caption?: string }[];
  height?: number | string;
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
}

export default function MUIImageCarousel({
  images,
  height = "100vh",
  autoPlay = true,
  interval = 4000,
  showIndicators = true,
}: ImageCarouselProps) {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  useEffect(() => {
    if (!autoPlay || maxSteps <= 1) return;
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % maxSteps);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, maxSteps]);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ width: '100%', flexGrow: 1 }}>
      <Box
        sx={{
          position: 'relative',
          height:"100vh",
          width: '100%',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Slide Wrapper */}
        <Box
          sx={{
            display: 'flex',
            width: `${maxSteps * 100}%`,
            transform: `translateX(-${activeStep * (100 / maxSteps)}%)`,
            transition: 'transform 0.6s ease',
            height: "95vh",
          }}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img.src}
              alt={img.alt ?? `slide-${idx}`}
              sx={{
                width: `${100 / maxSteps}%`,
                objectFit: 'contain',
                height: "95vh",
              }}
            />
          ))}
        </Box>

        {/* Caption */}
        {images[activeStep]?.caption && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 2,
              bgcolor: 'rgba(0,0,0,0.45)',
              height: "50vh",

            }}
          >
            <Typography variant="body1" color="common.white">
              {images[activeStep].caption}
            </Typography>
          </Box>
        )}

        {/* Navigation Buttons */}
        <IconButton
          onClick={handleBack}
          sx={{ position: 'absolute', left: 8, transform: 'translateY(-50%)' }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 8, transform: 'translateY(-50%)' }}
        >
          <KeyboardArrowRight />
        </IconButton>
           {showIndicators && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
          {images.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveStep(idx)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: idx === activeStep ? 'primary.main' : 'grey.400',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
             )}
      </Box>

        
 
    </Box>
  );
}

/* No external dependencies required now */