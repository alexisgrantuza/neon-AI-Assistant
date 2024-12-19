import React from "react";
import Drawer from "../components/Drawer";
import { ConversationArea } from "../components/UI1";
import { Leva } from "leva";
import { Experience } from "../components/Experience";
import { Canvas } from "@react-three/fiber";

function Users() {
  return (
    <>
      <Leva hidden />
      <ConversationArea />

      <Canvas shadows camera={{ position: [0, 0, 1], fov: 15 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default Users;
