import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDatabase, FaBrain } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

function ConcreteBlock() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color="#a9a9a9" roughness={1} metalness={0.1} />
    </mesh>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* 3D Concrete Block in the Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <Stars />
          <ConcreteBlock />
          <OrbitControls autoRotate enableZoom={false} />
        </Canvas>
      </div>

      {/* Animated Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-10 text-center max-w-lg w-full"
      >
        <h1 className="text-4xl font-extrabold text-purple-300 mb-8 drop-shadow-md">
          Concrete Crack Analysis
        </h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => navigate('/store')}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200 hover:shadow-cyan-400/50"
          >
            <FaDatabase size={22} /> Store Crack Images
          </button>

          <button
            onClick={() => navigate('/select-model')}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200 hover:shadow-pink-400/50"
          >
            <FaBrain size={22} />Analyze Cracks
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
