import "./Register.scss";

const Register = () => {
  return (
    <div className="reg-page">

      {/* ── Hero ── */}
      <div className="reg-hero">
        <p className="reg-pre-label">Algo(Rhythm) 2027 · Omaha, NE</p>
        <h1 className="reg-title">Get Your Pass</h1>
        <p className="reg-subtitle">Secure your spot at the stage. Mar 4–5, 2027.</p>
        <a
          className="reg-cta"
          href="https://reg.kernelcon.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register Now
        </a>
      </div>

      {/* ── Info cards ── */}
      <div className="reg-cards">

        <div className="reg-card">
          <p className="reg-card-label">Group Admission</p>
          <h2 className="reg-card-title">Rolling with a Crew?</h2>
          <p className="reg-card-body">
            Bring 10 or more and we'll cut you a deal. Groups get discounted
            passes — reach out and we'll sort the details.
          </p>
          <a className="reg-card-link" href="mailto:info@kernelcon.org">
            info@kernelcon.org
          </a>
        </div>

        <div className="reg-card">
          <p className="reg-card-label">Student Passes</p>
          <h2 className="reg-card-title">Student Scholarships</h2>
          <p className="reg-card-body">
            Can't afford the con? We've got you. Students 18 and over can
            apply for a scholarship — accepted students get conference
            admission, a hotel room if traveling, and this year's hacker
            education kit.
          </p>
          <p className="reg-card-label" style={{marginTop: '1rem'}}>To apply, send the following to{' '}
            <a className="reg-card-link" href="mailto:students@kernelcon.org">students@kernelcon.org</a>
          </p>
          <ul className="reg-scholarship-list">
            <li>Photo proof of enrollment — you + your student ID at school</li>
            <li>Letter of recommendation from an advisor or instructor</li>
            <li>Brief letter of interest — why Kernelcon, what you hope to learn</li>
            <li>At least one letter sent from a school email address</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Register;
