// import { CoolMode } from "../components/magicui/BaseParticle.js";
// import { cn } from "../lib/utils";
import { Splitter } from "antd";
// import { HiRefresh } from "react-icons/hi";
// import { Select } from "antd";  //
import Desc from "../components/ColorActions";
import { useQuery } from "@tanstack/react-query";
// import Loading from "../components/Loader";
import { useEffect, useState } from "react";

function Home() {
  const [myData, setMyData] = useState([]);
  // const [loadings, setLoadings] = useState(false);
  // const [colorMethod, setColorMethod] = useState("random"); 


  const query = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        const ress = await fetch("http://localhost:4000/", {
          credentials: "include",
        });
        if (ress.ok) {
          const result = await ress.json();
          setMyData(result);
          return result;
        }
      } catch (err) {
        console.log("error fetching");
      }
    },
  });

  async function toggleLock(id) {
    try {
      const ress = await fetch(
        `http://localhost:4000/item/${id}?element=state`,
        {
          credentials: "include",
        }
      );
      if (ress.ok) {
        setMyData((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, state: !item.state } : item
          )
        );
      }
    } catch (err) {
      console.log("error fetching");
    }
  }

  async function toggleLike(id) {
    try {
      const ress = await fetch(
        `http://localhost:4000/item/${id}?element=like`,
        {
          credentials: "include",
        }
      );
      if (ress.ok) {
        setMyData((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, like: !item.like } : item
          )
        );
      }
    } catch (err) {
      console.log("error fetching");
    }
  }

  async function reGenerate() {
    // setLoadings(true);
    try {
      const ress = await fetch(`http://localhost:4000/regenerate`, {
        credentials: "include",
      });
      if (ress.ok) {
        const data = await ress.json();
        if (data) {
          setMyData(data);
          // setLoadings(false);
        }
      }
    } catch (err) {
      console.log("error fetching");
    }
  }

  async function handleCodeChange(id, to) {
    try {
      const ress = await fetch(`http://localhost:4000/item/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ to: to }),
      });
      if (ress.ok) {
        const data = await ress.json();
        setMyData((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, color: data[id]["color"] } : item
          )
        );
        console.log(data[id]["color"]);
      }
    } catch (err) {
      console.log("error fetching");
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        reGenerate(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return query.isLoading ? (
    <p>loading...</p>
  ) : (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="gap-y-16 relative flex flex-col items-center justify-center w-screen overflow-hidden border h-full">
        <div className=" text-white h-full">
          <Splitter className=" w-screen overflow-hidden mx-auto h-full ">
            {myData.map((ele) => (
              <Splitter.Panel collapsible={{ start: true }} key={ele.id}>
                <Desc
                  data={ele}
                  toggleLock={toggleLock}
                  toggleLike={toggleLike}
                  handleCodeChange={handleCodeChange}
                />
              </Splitter.Panel>
            ))}
          </Splitter>
        </div>
      </div>
    </div>
  );
}

export default Home;
