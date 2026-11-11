import React from 'react';
import { STORE_CONTENT } from '../../common/storeConstants';

const HeroSection = () => {
  const { hero } = STORE_CONTENT;
  return (
    <section className="hero-section">
      <div className="hero-kicker">
        <span /> {hero.eyebrow} <span />
      </div>
      <h1>
        {hero.titleLead}
        <br />
        <em>{hero.titleEmphasis}</em>
      </h1>
      <p>{hero.description}</p>
      <a className="hero-button" href="#catalogue">
        {hero.action} <span aria-hidden="true">↓</span>
      </a>
      <div className="hero-bottom">
        {hero.bottomPoints.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
