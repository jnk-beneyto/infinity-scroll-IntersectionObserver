import React from "react";
import axios from "axios";

export default function App() {
  const [poke, setPoke] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pageNum, setPageNum] = React.useState(1);
  const [lastElement, setLastElement] = React.useState(null);

  const containerRef = React.useRef(null);
  const TOTAL_PAGES = 500;

  const observer = React.useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum((no) => no + 1);
      }
    })
  );

  const callUser = async () => {
    setLoading(true);
    let response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${pageNum * 20}&limit=20`
    );
    let all = new Set([...poke, ...response.data.results]);
    setPoke([...all]);
    console.log("all.length", poke.length);
    setLoading(false);
  };

  React.useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser();
    }
  }, [pageNum]);

  React.useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  return (
    <div className="App">
      <h1>Poke List</h1>
      <div ref={containerRef}>
        {poke.length &&
          pageNum <= TOTAL_PAGES &&
          poke.map(({ name }, index) => {
            return (
              <div
                key={`${name}-${index}`}
                style={{
                  background: "red",
                  marginBottom: "2px",
                  height: "50px"
                }}
                ref={setLastElement}
              >
                {name}
              </div>
            );
          })}
        {loading && (
          <p style={{ background: "blue", height: "30px" }}>loading...</p>
        )}
      </div>
    </div>
  );
}
