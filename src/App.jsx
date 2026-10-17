import { useEffect, useMemo, useState } from "react";
import {
  Users, Leaf, UtensilsCrossed, BookOpen, Mic, Gift, Camera, Cake, HeartHandshake,
  PersonStanding, CalendarDays, MapPin, Crown, Copy, Check, Lock, RotateCcw, ArrowLeft, Heart,
} from "lucide-react";
import { subscribe, setDone, resetAll } from "./speechStore";
import "./App.css";

const COUPLE = { bride: "Kakii", groom: "David" };
const EVENT = { date: "Saturday, 24th October 2026", venue: "Bongani Gardens, Karen", attire: "Traditional Attire (Ntheo)" };
const GIFT = { Mpesa: "0708083695", name: "Miriam Muthangya" }; // change later

const PROGRAMME = [
  ["10:00 AM", "Arrival & Registration", "Guests are welcomed and seated.", Users],
  ["11:00 AM", "Call to Order & Introductions", "MC welcomes guests and introduces the families.", Leaf],
  ["12:00 PM", "Lunch", "Enjoy a delicious meal.", UtensilsCrossed],
  ["1:30 PM", "Ntheo Dancing", "Groom and bridal team sit.", PersonStanding],
  ["2:00 PM", "Preaching", "A word of encouragement.", BookOpen],
  ["2:30 PM", "5 Minute Speeches", "From special guests and family.", Mic, true],
  ["3:00 PM", "Gifting", "Thank you for your generous gifts and support.", Gift],
  ["3:30 PM", "Photos", "Capture the special moments.", Camera],
  ["4:30 PM", "Cake", "A sweet celebration of our love.", Cake],
  ["5:00 PM", "Closing", "Thank you for being part of our journey.", HeartHandshake],
];

// Placeholder order of speeches - edit freely
const SPEECHES = [
  ["Kakii's Grandparents"], ["David's Grandparents"],
  ["Kakii's Parents"], ["David's Parents"],
  ["Kakii's Siblings"], ["David's Siblings"],
  ["Kakii's Aunties"], ["David's Aunties"],
  ["Kakii's Uncles"], ["David's Uncles"],
  ["Kakii's Cousins"], ["David's Cousins"],
  ["Kakii's Friends"], ["David's Friends"],
  ["Kakii's Work Colleagues"], ["David's Work Colleagues"],
  ["Vote of Thanks", "Closing remarks", "5"],
].map(([title, note, mins], i) => ({ id: `s${i + 1}`, n: i + 1, title, note, mins: Number(mins) || 5 }));

function Floral({ className }) {
  return (
    <svg className={`floral ${className}`} viewBox="0 0 300 300" aria-hidden="true">
      <g fill="#8a5a3b">
        {[[40, 150, -50], [90, 110, -20], [110, 190, 30], [60, 220, 60], [150, 80, -5], [160, 150, 10]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="14" ry="42" transform={`rotate(${r} ${x} ${y})`} opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </g>
      <g fill="#c9a98f">
        <ellipse cx="190" cy="40" rx="8" ry="30" transform="rotate(25 190 40)" />
        <ellipse cx="215" cy="60" rx="7" ry="26" transform="rotate(50 215 60)" />
      </g>
      <circle cx="75" cy="75" r="46" fill="#e5c3b0" />
      <circle cx="75" cy="75" r="34" fill="#dcb29e" />
      <circle cx="75" cy="75" r="22" fill="#d2a08a" />
      <circle cx="75" cy="75" r="10" fill="#c58f78" />
      {[[135, 40], [150, 60], [125, 25], [160, 35]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#f4e4d6" stroke="#b98d6e" />)}
    </svg>
  );
}

function Programme({ goSpeeches }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(GIFT.till); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <main className="poster">
      <Floral className="tl" />
      <Floral className="br" />
      <p className="together">Together<br />Forever <Heart size={10} fill="currentColor" /></p>

      <header className="hero">
        <p className="kicker">The Traditional Wedding of</p>
        <h1 className="names">{COUPLE.bride}<span className="amp">&amp;</span>{COUPLE.groom}</h1>
        <p className="tagline">Our Love <Heart size={9} fill="currentColor" /> Our Tradition <Heart size={9} fill="currentColor" /> Our Forever</p>
        <div className="brush"><span>Wedding Programme</span></div>
      </header>

      <section className="facts">
        <div><i><CalendarDays /></i><p><small>Date</small>{EVENT.date}</p></div>
        <div><i><MapPin /></i><p><small>Venue</small>{EVENT.venue}</p></div>
        <div><i><Crown /></i><p><small>{EVENT.attire}</small></p></div>
      </section>

      <div className="split">
        <section className="timeline">
          <h2 className="rule-title">Programme</h2>
          <ol>
            {PROGRAMME.map(([time, title, desc, Icon, hasSpeeches]) => (
              <li key={title}>
                <i className="ico"><Icon /></i>
                <time>{time}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  {hasSpeeches && (
                    <button className="pill" onClick={goSpeeches}>View Order of Speeches</button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="gratitude">
          <h2 className="script">With Gratitude</h2>
          <p>We are deeply grateful for your presence, love and support as we celebrate this special day. Your presence makes our joy even greater, and we are blessed to have you with us as we begin this new chapter of our lives together.</p>
          <hr />
          <p className="thanks">Thank you for coming, for the gifts, for the prayers and for being part of our story.</p>
          <p className="with-love">With love,</p>
          <p className="sign">{COUPLE.bride} &amp; {COUPLE.groom}</p>

          <div className="gift" id="gifting">
            <p className="gift-label">Send a Gift via M-Pesa</p>
            <div className="till">
              <div><small>0708083695</small><strong>{GIFT.till}</strong></div>
              <button className="copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
            </div>
            <div className="till"><div><small>Account Name</small><strong>{GIFT.name}</strong></div></div>
            <button className="pill solid">Use M-Pesa to send your Gift</button>
          </div>

          <div className="theme">
            <span className="brush small"><span>Theme Colours</span></span>
            <div className="dots"><b style={{ background: "#6b3a22" }} /><b style={{ background: "#d9bfa8" }} /><b style={{ background: "#d8b3a0" }} /></div>
            <p>Brown | Beige | Nude</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Speeches({ back }) {
  const [done, setDoneState] = useState({});
  const [mc, setMc] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);

  useEffect(() => subscribe(setDoneState), []);

  const currentId = SPEECHES.find((s) => !done[s.id])?.id;
  const doneCount = SPEECHES.filter((s) => done[s.id]).length;
  const minsLeft = useMemo(() => SPEECHES.filter((s) => !done[s.id]).reduce((a, s) => a + s.mins, 0), [done]);

  const unlock = (e) => {
    e.preventDefault();
    if (pin === (import.meta.env.VITE_MC_PIN || "2410")) { setMc(true); setPinOpen(false); setPin(""); setPinErr(false); }
    else setPinErr(true);
  };
  const toggle = (s) => setDone(s.id, !done[s.id], done);

  return (
    <main className="poster speeches">
      <Floral className="tl" />
      <Floral className="br" />
      <button className="back" onClick={back}><ArrowLeft size={16} /> Programme</button>

      <header className="hero compact">
        <p className="kicker">{COUPLE.bride} &amp; {COUPLE.groom}</p>
        <h1 className="script big">Order of Speeches</h1>
        <p className="live"><span className="pulse" /> Updates live for everyone</p>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={SPEECHES.length} aria-valuenow={doneCount}>
          <span style={{ width: `${(doneCount / SPEECHES.length) * 100}%` }} />
        </div>
        <p className="stat">{doneCount} of {SPEECHES.length} done{minsLeft > 0 && ` · about ${minsLeft} min left`}</p>
      </header>

      <ol className="speech-list">
        {SPEECHES.map((s) => {
          const state = done[s.id] ? "done" : s.id === currentId ? "now" : "next";
          return (
            <li key={s.id} className={state}>
              <span className="num">{state === "done" ? <Check size={16} /> : s.n}</span>
              <div className="body">
                <h3>{s.title}</h3>
                {s.note && <p>{s.note}</p>}
                {state === "now" && <em className="badge">Now speaking</em>}
              </div>
              <span className="mins">{s.mins} min</span>
              {mc && (
                <button className={`tick ${done[s.id] ? "on" : ""}`} onClick={() => toggle(s)} aria-pressed={!!done[s.id]} aria-label={`Mark ${s.title} ${done[s.id] ? "not done" : "done"}`}>
                  <Check size={18} />
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <footer className="mc-bar">
        {mc ? (
          <>
            <p>MC mode: tap a tick when a speech ends.</p>
            <button className="pill" onClick={() => confirm("Clear all ticks for everyone?") && resetAll()}><RotateCcw size={14} /> Reset</button>
            <button className="pill" onClick={() => setMc(false)}>Exit MC mode</button>
          </>
        ) : pinOpen ? (
          <form onSubmit={unlock}>
            <input autoFocus inputMode="numeric" type="password" placeholder="MC PIN" value={pin} onChange={(e) => { setPin(e.target.value); setPinErr(false); }} aria-invalid={pinErr} />
            <button className="pill solid">Unlock</button>
            {pinErr && <span className="err">Wrong PIN, try again.</span>}
          </form>
        ) : (
          <button className="pill" onClick={() => setPinOpen(true)}><Lock size={14} /> I'm the MC</button>
        )}
      </footer>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState(location.hash === "#speeches" ? "speeches" : "programme");
  useEffect(() => {
    location.hash = view === "speeches" ? "speeches" : "";
    window.scrollTo(0, 0);
  }, [view]);
  useEffect(() => {
    const h = () => setView(location.hash === "#speeches" ? "speeches" : "programme");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return view === "speeches" ? <Speeches back={() => setView("programme")} /> : <Programme goSpeeches={() => setView("speeches")} />;
}
