/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, act,  render, screen } from '@testing-library/react';
import ImageGallery from '../ImageGallery.jsx';

test('renders ImageGallery component without crashing', () => {
  const selectedStyle = {
    photos: [{ url: 'https://example.com/image.jpg' }, { url: 'https://example.com/image2.jpg' }], // Mock photos array
    // Add other necessary properties of selectedStyle
  };
  render(<ImageGallery selectedStyle={selectedStyle} />);
});
// describe('ImageGallery Component', () => {
//   const selectedStyle = {
//     photos: [
//       { url: 'https://example.com/image1.jpg', thumbnail_url: 'https://example.com/thumb1.jpg' },
//       { url: 'https://example.com/image2.jpg', thumbnail_url: 'https://example.com/thumb2.jpg' },
//       { url: 'https://example.com/image3.jpg', thumbnail_url: 'https://example.com/thumb3.jpg' },
//     ]
//   };

//   test('renders main image with correct URL', () => {
//     const { getByAltText } = render(<ImageGallery selectedStyle={selectedStyle} />);
//     const mainImage = getByAltText('main-image');
//     expect(mainImage).toBeInTheDocument();
//   });

//   test('clicking left arrow button decrements current image index', () => {
//     const { getByTestId } = render(<ImageGallery selectedStyle={selectedStyle} />);
//     const leftArrowButton = getByTestId('left-arrow');
//     fireEvent.click(leftArrowButton);
//     expect(leftArrowButton).toBeInTheDocument();
//   });
// });