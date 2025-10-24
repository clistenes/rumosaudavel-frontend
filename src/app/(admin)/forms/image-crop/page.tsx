import type { Metadata } from 'next'
import ImageCropper from './components/ImageCropper'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Image Crop' }

const ImageCrop = () => {
  return (
    <>
    <PageTitle title='Image Crop' subName='Forms' />
      <ImageCropper />
    </>
  )
}

export default ImageCrop
