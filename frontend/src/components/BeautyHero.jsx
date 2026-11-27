import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { heroBannerApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'

const defaultSlides = [
  {
    id: 'default-1',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=90',
    imageAlt: 'Bộ sản phẩm chăm sóc da trên nền sáng tối giản',
    caption: 'Lumi Beauty · Chăm sóc da có chọn lọc',
    title: 'Vẻ đẹp dịu dàng bắt đầu từ những điều tinh tế.',
    subtitle: 'Khám phá những sản phẩm chăm sóc da được chọn lọc cho nhịp sống riêng của bạn.',
    ctaLabel: 'Khám phá bộ sưu tập',
    ctaLink: '/#catalog'
  },
  {
    id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=90',
    imageAlt: 'Các sản phẩm chăm sóc da được sắp đặt tinh tế',
    caption: 'Lumi Edit · Những món được tuyển chọn',
    title: 'Một khoảng lặng cho làn da.',
    subtitle: 'Tìm kết cấu và công thức phù hợp cho chu trình chăm sóc mỗi ngày.',
    ctaLabel: 'Xem sản phẩm',
    ctaLink: '/#catalog'
  },
  {
    id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=90',
    imageAlt: 'Son môi và sản phẩm làm đẹp',
    caption: 'Lumi Beauty · Everyday essentials',
    title: 'Chọn điều khiến bạn cảm thấy là chính mình.',
    subtitle: 'Những món làm đẹp nhỏ xinh, dành cho khoảnh khắc bạn muốn nâng niu bản thân.',
    ctaLabel: 'Mua sắm ngay',
    ctaLink: '/#catalog'
  }
]

export default function BeautyHero() {
  const [slides, setSlides] = useState(defaultSlides)
  const [activeIndex, setActiveIndex] = useState(0)
  const { showToast } = useToast()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let active = true
    heroBannerApi.getActiveSlides()
      .then(({ data }) => {
        if (active && data.length > 0) {
          setSlides(data)
          setActiveIndex(0)
        }
      })
      .catch((error) => {
        if (active) showToast(error.message || 'Không thể tải banner mới nhất', 'error')
      })

    return () => {
      active = false
    }
  }, [showToast])

  useEffect(() => {
    if (reduceMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [reduceMotion, slides.length])

  const moveSlide = (direction) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length)
  }

  const slide = slides[activeIndex]
  const slideKey = slide.id ?? slide.imageUrl

  return (
    <motion.section
      id="luxury"
      className="beauty-hero"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="beauty-hero-copy">
        <span className="eyebrow">LUMI BEAUTY · CHĂM DA MỖI NGÀY</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={slideKey}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>
        <p>{slide.subtitle}</p>
        <a className="button button-primary beauty-hero-cta" href={slide.ctaLink}>
          {slide.ctaLabel}
          <span aria-hidden="true">↗</span>
        </a>
        <div className="beauty-promises">
          <span>Chọn lọc có tâm</span>
          <span>Giao hàng toàn quốc</span>
          <span>Thanh toán an toàn</span>
        </div>
      </div>

      <div
        className="beauty-hero-visual"
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} / ${slides.length}`}
      >
        <div className="beauty-hero-glow" aria-hidden="true" />
        <div className="beauty-hero-image">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={slideKey}
              src={slide.imageUrl}
              alt={slide.imageAlt}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/cosmetic-placeholder.svg'
              }}
            />
          </AnimatePresence>
          <span className="beauty-image-caption">{slide.caption}</span>
        </div>
        <div className="beauty-carousel-controls">
          <button type="button" aria-label="Ảnh trước" onClick={() => moveSlide(-1)}>‹</button>
          <div className="beauty-carousel-dots" aria-label="Chọn ảnh banner">
            {slides.map((item, index) => (
              <button
                key={item.id ?? item.imageUrl}
                type="button"
                aria-label={`Hiển thị ảnh ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Ảnh tiếp theo" onClick={() => moveSlide(1)}>›</button>
        </div>
        <span className="beauty-hero-index">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
      </div>
    </motion.section>
  )
}
