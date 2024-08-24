import React from 'react'

function Hero(
    {
        title='Welcome to Dynamik Blog',
        subtitle='From tech trends to lifestyle tips, dive into content that sparks curiosity and fuels your passion.',
    }
) {
  return (
    <section className="bg-dark-subtle text-dark hero pb-5 mb-5 mt-5">
        <div className="">
          <div className="text-center">
            <h1 className=" fw-bold title">{title}</h1>
            <p className="fst-italic fs-5">{subtitle}</p>
          </div>
        </div>
      </section>
  )
}

export default Hero