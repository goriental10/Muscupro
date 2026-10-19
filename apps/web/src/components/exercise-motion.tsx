"use client";
import { useEffect, useState } from "react";
type Pose = { head: [number, number]; body: string; limbs: string; load: string };
const poses: Record<string, [Pose, Pose]> = {
  squat: [
    { head: [117, 43], body: "M117 65 L116 119", limbs: "M116 77 L93 102 L117 103 M116 119 L102 153 L92 185 M116 119 L136 153 L147 185", load: "M92 185 L109 185 M139 185 L156 185" },
    { head: [128, 88], body: "M126 108 L102 142", limbs: "M125 116 L146 103 L167 102 M102 142 L144 150 L126 185 M102 142 L118 163 L101 185", load: "M92 185 L109 185 M119 185 L136 185" },
  ],
  bench: [
    { head: [65, 120], body: "M85 127 L150 135", limbs: "M99 128 L107 100 L130 113 M150 135 L174 159 L176 185 M150 135 L142 161 L139 185", load: "M121 110 L139 116 M123 105 L119 115 M141 111 L137 121" },
    { head: [65, 120], body: "M85 127 L150 135", limbs: "M99 128 L108 87 L113 56 M150 135 L174 159 L176 185 M150 135 L142 161 L139 185", load: "M103 56 L123 56 M103 51 L103 61 M123 51 L123 61" },
  ],
  row: [
    { head: [141, 66], body: "M125 80 L93 123", limbs: "M122 86 L141 115 L145 146 M93 123 L112 151 L110 185 M93 123 L78 151 L63 185", load: "M136 146 L156 146 M136 140 L136 152 M156 140 L156 152" },
    { head: [141, 66], body: "M125 80 L93 123", limbs: "M122 86 L98 87 L118 117 M93 123 L112 151 L110 185 M93 123 L78 151 L63 185", load: "M109 117 L129 117 M109 111 L109 123 M129 111 L129 123" },
  ],
  deadlift: [
    { head: [118, 43], body: "M118 65 L114 119", limbs: "M118 77 L132 105 L134 128 M114 119 L105 152 L103 185 M114 119 L127 152 L134 185", load: "M125 129 L145 129 M125 123 L125 135 M145 123 L145 135" },
    { head: [165, 106], body: "M146 112 L96 127", limbs: "M141 113 L144 141 L143 165 M96 127 L115 152 L103 185 M96 127 L120 155 L134 185", load: "M134 165 L154 165 M134 159 L134 171 M154 159 L154 171" },
  ],
  press: [
    { head: [120, 52], body: "M120 74 L120 126", limbs: "M120 82 L88 96 L85 64 M120 82 L152 96 L155 64 M120 126 L103 156 L100 185 M120 126 L137 156 L140 185", load: "M75 64 L95 64 M75 59 L75 69 M95 59 L95 69 M145 64 L165 64 M145 59 L145 69 M165 59 L165 69" },
    { head: [120, 52], body: "M120 74 L120 126", limbs: "M120 82 L102 52 L101 22 M120 82 L138 52 L139 22 M120 126 L103 156 L100 185 M120 126 L137 156 L140 185", load: "M91 22 L111 22 M91 17 L91 27 M111 17 L111 27 M129 22 L149 22 M129 17 L129 27 M149 17 L149 27" },
  ],
  curl: [
    { head: [114, 46], body: "M114 68 L114 121", limbs: "M114 79 L129 108 L133 139 M114 121 L102 154 L98 185 M114 121 L130 154 L139 185", load: "M124 139 L144 139 M124 134 L124 144 M144 134 L144 144" },
    { head: [114, 46], body: "M114 68 L114 121", limbs: "M114 79 L129 108 L144 77 M114 121 L102 154 L98 185 M114 121 L130 154 L139 185", load: "M135 77 L155 77 M135 72 L135 82 M155 72 L155 82" },
  ],
};
export function ExerciseMotion({ exerciseId, playing = true, small = false }: { exerciseId: string; playing?: boolean; small?: boolean }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = matchMedia("(prefers-reduced-motion: reduce)"); const changed = () => setReduced(media.matches); changed(); media.addEventListener("change", changed); return () => media.removeEventListener("change", changed); }, []);
  const [from, to] = poses[exerciseId] ?? poses.squat;
  const running = playing && !reduced;
  const animate = (attributeName: string, a: string | number, b: string | number) => running ? <animate attributeName={attributeName} values={`${a};${b};${a}`} dur="3.4s" repeatCount="indefinite" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" /> : null;
  return <div className={`exercise-visual ${small ? "small" : ""}`}><svg className="motion-svg" viewBox="0 0 240 210" role="img" aria-label={`Schéma de mouvement : ${exerciseId}`}><ellipse cx="120" cy="189" rx="77" ry="7" fill="#7458ff" opacity=".1" /><path d="M35 187H205" stroke="#394050" />{exerciseId === "bench" && <path d="M60 144H159M74 145v39m75-39v39" stroke="#60687b" strokeWidth="8" strokeLinecap="round" />}<path d={from.limbs} stroke="#adb6cc" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none">{animate("d", from.limbs, to.limbs)}</path><path d={from.body} stroke="#a68cff" strokeWidth="22" strokeLinecap="round" fill="none">{animate("d", from.body, to.body)}</path><circle cx={from.head[0]} cy={from.head[1]} r="13" fill="#d4daeb">{animate("cx", from.head[0], to.head[0])}{animate("cy", from.head[1], to.head[1])}</circle><path d={from.load} stroke={exerciseId === "squat" ? "#adb6cc" : "#6de3cc"} strokeWidth="5" strokeLinecap="round" fill="none">{animate("d", from.load, to.load)}</path></svg><span className="motion-label"><span className={running ? "status-dot" : "paused-dot"} />{running ? "Mouvement animé" : "Position de départ"}</span></div>;
}
