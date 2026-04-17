import { useState } from 'react'

const CardThumbnail = ({
  src,
  alt,
  fallback,
  className = '',
  imageClassName = '',
  onClick,
}) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={className} onClick={onClick}>
      {!src || imageFailed ? (
        fallback
      ) : (
        <img
          src={src}
          alt={alt}
          className={imageClassName}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  )
}

export default CardThumbnail
