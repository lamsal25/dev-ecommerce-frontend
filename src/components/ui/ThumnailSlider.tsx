// components/ThumnailSlider.tsx
import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import Carousel, {
  Slider,
  SliderContainer,
  ThumsSlider,
} from '@/components/ui/carousel';
import Image from 'next/image';

interface ThumnailSliderProps {
  images: string[];
}

const ThumnailSlider: React.FC<ThumnailSliderProps> = ({ images }) => {
  const OPTIONS: EmblaOptionsType = { loop: false };

  return (
    <div className="2xl:w-[70%] sm:w-[80%] w-[90%] mx-auto">
      <Carousel options={OPTIONS} className="relative" isAutoPlay={true}>
        <SliderContainer className="gap-2">
          {images.map((img, index) => (
            <Slider
              key={index}
              className="xl:h-[400px] sm:h-[350px] h-[300px] w-full"
              thumnailSrc={img}
            >
              <Image
                src={img}
                width={1400}
                height={800}
                alt={`Product image ${index + 1}`}
                className="h-full object-cover rounded-lg w-full"
              />
            </Slider>
          ))}
        </SliderContainer>
        <ThumsSlider />
      </Carousel>
    </div>
  );
};

export default ThumnailSlider;
