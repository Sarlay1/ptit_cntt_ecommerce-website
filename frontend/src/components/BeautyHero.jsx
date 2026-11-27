import { useEffect, useState } from 'react'
import InteractiveImage from './InteractiveImage'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85',
    alt: 'Bộ sản phẩm chăm sóc da',
    caption: 'Một khoảng lặng dịu dàng cho làn da'
  },
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
    alt: 'Bộ mỹ phẩm trang điểm',
    caption: 'Những lựa chọn nhỏ, niềm vui mỗi ngày'
  },
  {
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
    alt: 'Son môi và sản phẩm làm đẹp',
    caption: 'Chọn điều khiến bạn cảm thấy là chính mình'
  }
]

export default function BeautyHero() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 2000)

    return () => window.clearInterval(timer)
  }, [])

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  const slide = slides[activeSlide]

  return (
    <section className="beauty-hero">
      <div className="beauty-hero-copy">
        <span className="eyebrow">LUMI BEAUTY · CHĂM SÓC DA CÓ CHỌN LỌC</span>
        <h1>Chăm sóc tốt bắt đầu từ điều làn da cần.</h1>
        <p>Lumi Beauty chọn những món chăm sóc da, trang điểm và tóc dễ đưa vào nhịp sống hằng ngày.</p>
        <a className="button button-primary beauty-hero-cta" href="#catalog">Khám phá sản phẩm</a>
        <div className="beauty-promises">
          <span>Tư vấn theo nhu cầu</span>
          <span>Giao hàng toàn quốc</span>
          <span>Thanh toán an toàn</span>
        </div>
      </div>
      <div className="beauty-hero-image" role="group" aria-roledescription="slide" aria-label={`${activeSlide + 1} / ${slides.length}`}>
        <InteractiveImage
          className="beauty-hero-photo"
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/cosmetic-placeholder.svg'
          }}
        />
        <span className="beauty-image-caption" aria-live="polite">{slide.caption}</span>
        <div className="beauty-carousel-controls">
          <button type="button" aria-label="Ảnh trước" onClick={() => moveSlide(-1)}>‹</button>
          <div className="beauty-carousel-dots" aria-label="Chọn ảnh banner">
            {slides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                aria-label={`Hiển thị ảnh ${index + 1}`}
                aria-pressed={index === activeSlide}
                className={index === activeSlide ? 'active' : ''}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Ảnh tiếp theo" onClick={() => moveSlide(1)}>›</button>
        </div>
      </div>
    </section>
  )
}
