/** Static SVG drawing shown until (or instead of, if WebGL fails) the 3D scene. */
export default function BlueprintFallback() {
  return (
    <svg
      viewBox="0 0 500 430"
      fill="none"
      className="blueprint-fallback"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <g
          key={index}
          className={`fallback-floor fallback-floor-${index}`}
          transform={`translate(0 ${105 - index * 90})`}
        >
          <path
            d="M70 170 250 70 430 170 250 270ZM70 170V183L250 283 430 183V170M250 270V283"
            fill="currentColor"
            fillOpacity=".045"
          />
          <path d="m150 165 110 61m-85-78 110 61m-85-78 75 42" opacity=".4" />
        </g>
      ))}
    </svg>
  );
}
