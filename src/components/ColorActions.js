import {  Typography, Dropdown } from "antd";
import { FaLock, FaLockOpen, FaRegHeart, FaHeart } from "react-icons/fa6";
import { GoCopy } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { toast } from 'react-toastify'; 


const Desc = (props) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(props.data.color).then(() => {
      toast.success("Color copied to clipboard!", { autoClose: 1500 }); 
    }).catch(err => {
      toast.error("Failed to copy: " + err.message); 
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <button className="text-xs" onClick={() => props.handleCodeChange(props.data.id, "hex")}>
          HEX
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button className="text-xs" onClick={() => props.handleCodeChange(props.data.id, "hsl")}>
          HSL
        </button>
      ),
    },
    {
      key: "3",
      label: (
        <button className="text-xs" onClick={() => props.handleCodeChange(props.data.id, "rgb")}>
          RGB
        </button>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: props.data.color,
        position: "relative",
      }}
      className=" p-relative transition-colors flex justify-center items-center"
    >
      <Typography.Title
        type="secondary"
        level={5}
        style={{ whiteSpace: "nowrap", color: "white" }}
        className="font-mono"
      >
        {props.data.color}
      </Typography.Title>
      <div className="absolute w-full bg-[#242424] bottom-0 left-0 p-3 flex items-center justify-evenly">
        <button className="text-red">
          {props.data.state ? (
            <FaLock className="fill-[#777] hover:fill-[#fff]" onClick={() => props.toggleLock(props.data.id)} />
          ) : (
            <FaLockOpen className="fill-[#777] hover:fill-[#fff]" onClick={() => props.toggleLock(props.data.id)} />
          )}
        </button>
        <button onClick={handleCopy}>
          <GoCopy className="fill-[#777] hover:fill-[#fff]" />
        </button>
        <button>
          {props.data.like ? (
            <FaHeart className="fill-[#ff0033bd] hover:fill-[#ff0033]" onClick={() => props.toggleLike(props.data.id)} />
          ) : (
            <FaRegHeart className="fill-[#777] hover:fill-[#fff]" onClick={() => props.toggleLike(props.data.id)} />
          )}
        </button>
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <IoMdSettings className="fill-[#777] hover:fill-[#fff]" />
        </Dropdown>
      </div>
    </div>
  );
};

export default Desc;
