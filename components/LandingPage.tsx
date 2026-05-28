'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const EVENT_DATE = new Date('2026-06-09T14:30:00+07:00').getTime()
const IMG_BASE = 'https://haiphong-solopreneur.lovable.app/assets/'
const EVENT_IMGS = [
  'event-1-CY2Vcav3.jpeg', 'event-2-BodlCVtx.jpeg', 'event-3-CHkwgrI3.jpeg',
  'event-4-DN75t-sC.jpeg', 'event-5-DKSEKqDe.jpeg', 'event-6-wp0krebj.jpeg',
  'event-7-FeuWDTCM.jpeg',
]
const POSTER_IMGS = [
  'poster-1-BS-HQm0R.jpg', 'poster-2-CKgMFOSC.jpg', 'poster-3-BPqy515X.jpg',
  'poster-4-C8Jfj1k-.jpg', 'community-CJSrYHNB.jpg',
]
const STRIP_WORDS = [
  'Doanh nghiệp 1 người', 'OPC', 'Solopreneur', 'AI thực chiến',
  'Networking cấp cao', 'Đột phá thể chế', 'Hợp lực công tư',
]

function pad(n: number) { return String(n).padStart(2, '0') }

function useCountdown() {
  const [cd, setCd] = useState({ d: '00', h: '00', m: '00', s: '00', days: 0 })
  const [flash, setFlash] = useState(false)
  const prevS = useRef(-1)

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, EVENT_DATE - Date.now())
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCd({ d: pad(d), h: pad(h), m: pad(m), s: pad(s), days: d })
      if (s !== prevS.current) {
        prevS.current = s
        setFlash(true)
        setTimeout(() => setFlash(false), 170)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return { cd, flash }
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -7% 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

interface FormData { name: string; phone: string; email: string; company: string; interest: string }
type PkgVal = '100' | '500'

export default function LandingPage() {
  const { cd, flash } = useCountdown()
  const scrolled = useNavScroll()
  useReveal()

  const [pkg, setPkg] = useState<PkgVal>('500')
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '', company: '', interest: '' })
  const [formState, setFormState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [formMsg, setFormMsg] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectPkg = useCallback((val: PkgVal) => setPkg(val), [])

  const handlePickClick = useCallback((pick: string) => {
    if (pick === '100' || pick === '500') selectPkg(pick as PkgVal)
    document.getElementById('dang-ky')?.scrollIntoView({ behavior: 'smooth' })
  }, [selectPkg])

  const toggleFaq = useCallback((idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setFormState('err')
      setFormMsg('Vui lòng nhập đầy đủ Họ tên và Số điện thoại.')
      return
    }
    setFormState('loading')
    try {
      const pkgLabel = pkg === '100' ? 'Sign In – 100.000đ' : 'Combo + Gala – 500.000đ'
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pkg: pkgLabel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi máy chủ.')
      setFormState('ok')
      setFormMsg(`✓ Cảm ơn ${form.name.trim()}! Đăng ký đã được ghi nhận. Chúng tôi sẽ liên hệ qua ${form.phone.trim()} để xác nhận & hướng dẫn thanh toán.`)
    } catch (err) {
      setFormState('err')
      setFormMsg(err instanceof Error ? err.message : 'Lỗi máy chủ.')
    }
  }, [form, pkg])

  // Duplicate images for seamless marquee loop
  const mqEvents = [...EVENT_IMGS, ...EVENT_IMGS]
  const mqPosters = [...POSTER_IMGS, ...POSTER_IMGS]
  const stripItems = [...STRIP_WORDS, ...STRIP_WORDS]

  return (
    <>
      {/* NAV */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wrap nav-inner">
          <a href="#top" className="brand">
            <span className="brand-mark">H</span>
            <span className="brand-txt"><b>H—SOLO</b><span>Hải Phòng</span></span>
          </a>
          <div className="nav-links">
            <a href="#gia-tri">Giá trị</a>
            <a href="#agenda">Chương trình</a>
            <a href="#h-solo">H-SOLO</a>
            <a href="#ve">Gói vé</a>
            <a href="#faq">Hỏi đáp</a>
          </div>
          <div className="nav-cta">
            <div className="nav-chip">⏱ Còn <b>{cd.days}</b> ngày</div>
            <a href="#dang-ky" className="btn btn-red">Đăng ký <span className="arrow">→</span></a>
            <button className="menu-btn" onClick={() => document.getElementById('dang-ky')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Menu">☰</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        <div className="wrap">
          <div className="hero-top">
            <div className="l"><span className="blink"></span><span className="lbl">Vòng địa phương — Hải Phòng 2026</span></div>
            <span className="lbl">Sự kiện ra mắt cộng đồng H-SOLO</span>
          </div>
          <div className="hero-grid">
            <div>
              <h1>Diễn đàn<br />Kinh tế<br /><span className="red">Tư nhân</span> <span className="out">HP</span></h1>
              <p className="hero-quote">&ldquo;Đột phá thể chế <b>—</b> Hợp lực công tư&rdquo;. Chuyên đề <b>Doanh nghiệp 1 người</b> OPC / Solopreneur: chiến lược khởi nghiệp tinh gọn trong kỷ nguyên công nghệ.</p>
              <div className="hero-info">
                <div className="hinfo"><div className="k">Thời gian</div><div className="v">09 · 06 · 2026</div></div>
                <div className="hinfo"><div className="k">Khung giờ</div><div className="v">14:30 – 17:35</div></div>
                <div className="hinfo"><div className="k">Địa điểm</div><div className="v">Nhà hát Hoa Phượng</div></div>
              </div>
              <div className="hero-actions">
                <a href="#dang-ky" className="btn btn-red">Đăng ký tham dự ngay <span className="arrow">→</span></a>
                <a href="#h-solo" className="btn btn-out">Tìm hiểu H-SOLO</a>
              </div>
            </div>
            <aside className="stub">
              <div className="stub-in">
                <div className="stub-tag"><span>Vé tham dự</span><span className="red">● Đang mở</span></div>
                <div className="stub-date">09.06<small>THÁNG 6 / 2026</small></div>
                <div className="stub-meta">
                  <b>Chuyên đề:</b> Doanh nghiệp 1 người (OPC / Solopreneur)<br />
                  <b>◷</b> 14h30 – 17h35 · Buổi chiều<br />
                  <b>◉</b> Nhà hát Hoa Phượng, Hải Phòng
                </div>
              </div>
              <div className="perf"></div>
              <div className="stub-cd">
                <div className="cdl">Khai mạc sau</div>
                <div className="cd">
                  <div className="c"><div className="num">{cd.d}</div><div className="u">Ngày</div></div>
                  <div className="c"><div className="num">{cd.h}</div><div className="u">Giờ</div></div>
                  <div className="c"><div className="num">{cd.m}</div><div className="u">Phút</div></div>
                  <div className={`c${flash ? ' flash' : ''}`}><div className="num">{cd.s}</div><div className="u">Giây</div></div>
                </div>
                <a href="#dang-ky" className="btn btn-out" style={{ color: 'var(--paper)' }}>Giữ chỗ ngay <span className="arrow">→</span></a>
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* MARQUEE STRIP */}
      <div className="strip">
        <div className="strip-track">
          {stripItems.map((word, i) => <span key={i}>{word}</span>)}
        </div>
      </div>

      {/* VALUES */}
      <section className="section" id="gia-tri">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">01 / VÌ SAO THAM DỰ</span><span className="lbl">06 giá trị</span></div>
              <h2>Một sự kiện<br />Sáu giá trị <span style={{ color: 'var(--red)' }}>đột phá</span></h2>
            </div>
            <p data-reveal data-d="1">Dành cho doanh nhân, founder, freelancer và mọi người sẵn sàng bước vào kỷ nguyên Solopreneur.</p>
          </div>
          <div className="vlist">
            {[
              ['01', 'Hiểu xu hướng OPC', 'Nắm bắt mô hình "Doanh nghiệp 1 người" đang định hình tương lai.'],
              ['02', 'Ứng dụng AI thực chiến', 'Vận hành kinh doanh tinh gọn bằng AI và công nghệ số.'],
              ['03', 'Networking cấp cao', 'Kết nối doanh nhân – startup – chuyên gia – nhà đầu tư.'],
              ['04', 'Tư duy Solopreneur', 'Tiếp cận tư duy OPC hiện đại, độc lập và bền vững.'],
              ['05', 'Hệ sinh thái Hải Phòng', 'Hòa nhập cộng đồng doanh nhân trẻ tiên phong.'],
              ['06', 'Đón đầu kinh tế tư nhân', 'Cập nhật chiến lược chuyển đổi số & cải cách thể chế.'],
            ].map(([n, title, desc]) => (
              <div key={n} className="vrow" data-reveal>
                <div className="vn">{n}</div>
                <h3>{title}</h3>
                <div className="vd">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="section agenda" id="agenda">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">02 / CHƯƠNG TRÌNH</span><span className="lbl">14:30 – 17:35</span></div>
              <h2>Hành trình<br />3 giờ <span style={{ color: 'var(--red)' }}>bứt phá</span></h2>
            </div>
            <p data-reveal data-d="1">Sáu chặng nội dung liền mạch — từ kết nối, tham luận đến tọa đàm cấp cao và cam kết hành động.</p>
          </div>
          <div data-reveal>
            {[
              ['14:30', 'Check-in & Networking', 'Đón tiếp đại biểu, kết nối khởi đầu.', 'Mở cửa'],
              ['15:00', 'Khai mạc diễn đàn', 'Phát biểu chào mừng từ Ban tổ chức & đại diện chính quyền.', 'Khai mạc'],
              ['15:30', 'Tham luận chuyên gia', 'Kinh tế tư nhân • Đổi mới sáng tạo • Chuyển đổi số • Hệ sinh thái khởi nghiệp.', 'Keynote'],
              ['16:00', 'Chuyên đề OPC / Solopreneur', 'Doanh nghiệp 1 người – Chiến lược tinh gọn trong kỷ nguyên AI.', 'Trọng tâm'],
              ['16:45', 'Tọa đàm cấp cao', '"Đột phá thể chế – Hợp lực công tư" cùng panel chuyên gia.', 'Panel'],
              ['17:30', 'Tổng kết & Bế mạc', 'Cam kết hành động và mở rộng cộng đồng H-SOLO.', 'Bế mạc'],
            ].map(([time, title, desc, tag]) => (
              <div key={time} className="arow">
                <div className="atime">{time}</div>
                <div className="abody"><h3>{title}</h3><p>{desc}</p></div>
                <span className="atag">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H-SOLO */}
      <section className="section hsolo" id="h-solo">
        <div className="wrap hs-grid">
          <div data-reveal>
            <div className="sec-tag"><span className="n">03 / HỆ SINH THÁI</span><span className="lbl">H-SOLO Hải Phòng</span></div>
            <h2>Hệ sinh thái<br />Doanh nghiệp<br />1 người</h2>
            <ul className="hs-list">
              {[
                ['A', 'Cộng đồng Solopreneur tiên phong tại Hải Phòng'],
                ['B', 'Hướng tới 2.000 H-SOLO giai đoạn 2026–2030'],
                ['C', 'Đào tạo AI – Marketing – Kinh doanh số'],
                ['D', 'Kết nối mentor – startup – doanh nghiệp'],
                ['E', 'Phát triển doanh nghiệp 1 người bằng công nghệ'],
              ].map(([key, text]) => (
                <li key={key}><span className="n">{key}</span><span>{text}</span></li>
              ))}
            </ul>
            <div className="hs-slogan">
              <span className="sm">Slogan</span>
              Một người — Một hệ thống — Một thương hiệu — Một tương lai thịnh vượng
            </div>
          </div>
          <div className="hs-media" data-reveal data-d="1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG_BASE}community-CJSrYHNB.jpg`} alt="Cộng đồng H-SOLO" />
            <div className="yr"><b>2026</b><span>Năm bứt phá</span></div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="ve">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">04 / GÓI VÉ</span><span className="lbl">Quyền lợi tham gia</span></div>
              <h2>Chọn gói<br />phù hợp <span style={{ color: 'var(--red)' }}>với bạn</span></h2>
            </div>
            <p data-reveal data-d="1">Đầu tư cho một sự kiện — mở khóa cả một hệ sinh thái.</p>
          </div>
          <div className="pgrid" data-reveal>
            <div className="pcard">
              <div className="p-tier">Cơ bản</div>
              <h3>Sign In<br />Buổi Chiều</h3>
              <div className="p-price"><span className="amt">100K</span><span className="cur">VNĐ</span></div>
              <ul className="p-feats">
                <li>Tham dự toàn bộ diễn đàn (14h30 – 17h35)</li>
                <li>Tài liệu chương trình</li>
                <li>Kết nối cộng đồng H-SOLO Hải Phòng</li>
                <li>Tham gia networking buổi chiều</li>
              </ul>
              <button className="btn btn-out" onClick={() => handlePickClick('100')}>Đăng ký gói 100K <span className="arrow">→</span></button>
            </div>
            <div className="pcard feat">
              <div className="p-flag">★ Chọn nhiều nhất</div>
              <div className="p-tier">Combo Premium</div>
              <h3>Combo Diễn đàn<br />+ Gala Dinner</h3>
              <div className="p-price"><span className="amt">500K</span><span className="cur">VNĐ</span></div>
              <ul className="p-feats">
                <li>Toàn bộ chương trình diễn đàn</li>
                <li>Gala Dinner buổi tối</li>
                <li>Networking doanh nhân cấp cao</li>
                <li>Kết nối VIP với mentor & nhà đầu tư</li>
                <li>Ưu tiên cộng đồng thành viên sáng lập</li>
              </ul>
              <button className="btn btn-red" onClick={() => handlePickClick('500')}>Đăng ký gói 500K <span className="arrow">→</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section className="section register" id="dang-ky">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">05 / ĐĂNG KÝ</span><span className="lbl">Số lượng có hạn</span></div>
              <h2>Xác nhận<br />suất <span style={{ color: 'var(--red)' }}>tham dự</span></h2>
            </div>
            <p data-reveal data-d="1">Điền thông tin để giữ chỗ — chúng tôi sẽ liên hệ xác nhận & hướng dẫn thanh toán.</p>
          </div>
          <form className="form-wrap" onSubmit={handleSubmit} data-reveal noValidate>
            <div className="fgrid">
              <div className="field">
                <label>Họ và tên <span className="req">*</span></label>
                <input type="text" placeholder="Nguyễn Văn A" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Số điện thoại <span className="req">*</span></label>
                <input type="tel" placeholder="09xx xxx xxx" required value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="ban@email.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field">
                <label>Công ty / Lĩnh vực</label>
                <input type="text" placeholder="Công ty / ngành nghề" value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
            </div>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink-soft)', display: 'block', marginBottom: 12 }}>
              Chọn gói tham dự <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <div className="pkg-pick">
              <label className={`pkg-opt${pkg === '100' ? ' sel' : ''}`} onClick={() => selectPkg('100')}>
                <input type="radio" name="pkg" readOnly checked={pkg === '100'} />
                <div className="pk-name">Sign In</div>
                <div className="pk-price">100.000đ · Buổi chiều</div>
              </label>
              <label className={`pkg-opt${pkg === '500' ? ' sel' : ''}`} onClick={() => selectPkg('500')}>
                <input type="radio" name="pkg" readOnly checked={pkg === '500'} />
                <div className="pk-name">Combo + Gala</div>
                <div className="pk-price">500.000đ · Trọn gói VIP</div>
              </label>
            </div>
            <div className="field full" style={{ marginBottom: 28 }}>
              <label>Bạn quan tâm điều gì?</label>
              <textarea placeholder="Chia sẻ kỳ vọng của bạn về sự kiện..." value={form.interest} onChange={(e) => setForm(f => ({ ...f, interest: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-red" style={{ width: '100%', justifyContent: 'center' }} disabled={formState === 'loading' || formState === 'ok'}>
              {formState === 'loading' ? 'Đang gửi...' : formState === 'ok' ? 'Đã gửi đăng ký ✓' : 'Xác nhận đăng ký'} {formState !== 'ok' && <span className="arrow">→</span>}
            </button>
            <div className="form-note">Sau khi xác nhận, bạn sẽ được chuyển đến trang thanh toán & tham gia cộng đồng H-SOLO.</div>
            {formMsg && (
              <div className={`form-msg visible${formState === 'err' ? ' error' : ''}`}>{formMsg}</div>
            )}
          </form>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section gallery">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">06 / KHOẢNH KHẮC</span><span className="lbl">Cộng đồng đang lớn mạnh</span></div>
              <h2>Hệ sinh thái<br />H-SOLO</h2>
            </div>
            <p data-reveal data-d="1">Diễn đàn Kinh tế Tư nhân – Cụm Đồng bằng Sông Hồng (Hải Phòng, 20/8/2025). Di chuột để xem ảnh màu.</p>
          </div>
        </div>
        <div className="mq-row">
          <div className="mq">
            {mqEvents.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} loading="lazy" src={`${IMG_BASE}${f}`} alt="H-SOLO" />
            ))}
          </div>
        </div>
        <div className="mq-row poster-row" style={{ marginTop: 16 }}>
          <div className="mq rev">
            {mqPosters.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} loading="lazy" src={`${IMG_BASE}${f}`} alt="H-SOLO" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section agenda" id="faq">
        <div className="wrap">
          <div className="sec-head">
            <div className="l" data-reveal>
              <div className="sec-tag"><span className="n">07 / HỎI ĐÁP</span><span className="lbl">Giải đáp nhanh</span></div>
              <h2>Bạn cần<br />giải đáp gì?</h2>
            </div>
          </div>
          <div className="faq-list" data-reveal>
            {[
              ['01', 'Có cần là doanh nghiệp mới được tham gia?', 'Không. Freelancer, startup, sinh viên, chủ kinh doanh – ai cũng có thể tham gia.'],
              ['02', 'Tôi chưa biết AI, có tham gia được không?', 'Có. Chương trình phù hợp cả người mới, với những nội dung dễ tiếp cận và thực chiến.'],
              ['03', 'Gala Dinner có bắt buộc không?', 'Không. Bạn có thể chọn riêng gói Sign In 100K nếu chỉ tham dự buổi chiều.'],
              ['04', 'Sau chương trình có được tham gia cộng đồng không?', 'Có. Toàn bộ người tham dự được mời vào cộng đồng H-SOLO Hải Phòng.'],
            ].map(([n, q, a], idx) => (
              <div key={n} className={`faq-item${openFaq === idx ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => toggleFaq(idx)}>
                  <span className="fn">{n}</span>
                  <h3>{q}</h3>
                  <span className="ic">+</span>
                </div>
                <div
                  className="faq-a"
                  ref={(el) => { faqRefs.current[idx] = el }}
                  style={{ maxHeight: openFaq === idx ? (faqRefs.current[idx]?.scrollHeight ?? 200) : 0 }}
                >
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap">
          <div className="lbl" style={{ color: '#ff6a4d', marginBottom: 20 }} data-reveal>Đừng bỏ lỡ</div>
          <h2 data-reveal data-d="1">Gia nhập<br />H-SOLO <span className="red">hôm nay</span></h2>
          <p data-reveal data-d="2">Một người — Một hệ thống — Một tương lai lớn</p>
          <a href="#dang-ky" className="btn btn-out" data-reveal data-d="3" style={{ fontSize: 16, padding: '18px 36px' }}>
            Đăng ký ngay <span className="arrow">→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <a href="#top" className="brand">
                <span className="brand-mark">H</span>
                <span className="brand-txt"><b>H—SOLO Hải Phòng</b><span>HP Solopreneur Community</span></span>
              </a>
              <p>Hệ sinh thái Doanh nghiệp 1 người tiên phong tại Hải Phòng. Đột phá thể chế – Hợp lực công tư.</p>
            </div>
            <div className="foot-col">
              <h4>Đơn vị triển khai</h4>
              <div className="foot-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${IMG_BASE}logo-clb-CepnjPij.png`} alt="CLB Đầu tư & Khởi nghiệp Hải Phòng" />
                <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>CLB Đầu tư & Khởi nghiệp Hải Phòng</span>
              </div>
            </div>
            <div className="foot-col">
              <h4>Liên hệ</h4>
              <a href="tel:0972386967">Hotline: 0972 386 967</a>
              <p>Nhà hát Hoa Phượng – Hải Phòng</p>
              <a href="https://zalo.me/0972386967" target="_blank" rel="noopener noreferrer">Zalo: 0972 386 967</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 H-SOLO Hải Phòng. All rights reserved.</span>
            <span>Đột phá thể chế – Hợp lực công tư</span>
          </div>
        </div>
      </footer>

      {/* FLOATS */}
      <div className="floats">
        <a href="https://zalo.me/0972386967" target="_blank" rel="noopener noreferrer" className="float-btn float-zalo"><b>Z</b><span className="txt">Chat Zalo</span></a>
        <a href="tel:0972386967" className="float-btn float-call">☎<span className="txt">Gọi ngay</span></a>
      </div>
    </>
  )
}
