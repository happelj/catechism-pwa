import { useNavigate } from "react-router-dom";

export function AboutScreen() {
  const navigate = useNavigate();

  return (
    <main className="about-screen">
      <div className="secondary-actions about-actions">
        <button className="text-action" onClick={() => navigate("/")} type="button">Questions</button>
      </div>

      <div className="about-layout">
        <img
          alt="Westminster Catechizer logo"
          className="about-logo"
          src="/assets/wc-icon-512.png"
        />
        <h1>About Westminster Catechizer</h1>

        <section className="about-section" aria-label="About Westminster Catechizer">
          <p>
            Westminster Catechizer was created to help Christians study, review, and memorize the
            Westminster Shorter Catechism in a clean, accessible, and easy-to-use format.
          </p>
          <p>
            The goal of the app is simplicity and usefulness: allowing believers, families, and
            churches to practice catechism questions regularly while tracking memorization progress
            over time.
          </p>
          <p>
            Whether used for personal devotion, family worship, catechism classes, or church study,
            Westminster Catechizer is designed to encourage deeper familiarity with the truths
            summarized in the Westminster Standards and grounded in the Holy Scriptures.
          </p>
        </section>

        <section className="about-section">
          <h2>Credits</h2>
          <p>In Progress</p>
        </section>

        <section className="about-section">
          <h2>Privacy</h2>
          <p>
            Westminster Catechizer does not collect personal data, analytics, or tracking
            information.
          </p>
          <p>
            All memorization progress, preferences, and settings are stored locally on your device
            and are not transmitted to external servers.
          </p>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>If you experience any problems with the app, please email:</p>
          <a className="about-email" href="mailto:makariosdevelopment@gmail.com">
            makariosdevelopment@gmail.com
          </a>
        </section>
      </div>
    </main>
  );
}
