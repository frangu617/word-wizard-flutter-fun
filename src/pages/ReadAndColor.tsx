
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, Volume2, Download, Eraser } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

// Color palette
const colors = [
  { name: "red", value: "#ff6b6b" },
  { name: "blue", value: "#74b9ff" },
  { name: "green", value: "#55efc4" },
  { name: "yellow", value: "#ffeaa7" },
  { name: "purple", value: "#a29bfe" },
  { name: "orange", value: "#fab1a0" },
  { name: "pink", value: "#fd79a8" },
  { name: "brown", value: "#e17055" },
  { name: "black", value: "#2d3436" },
  { name: "white", value: "#ffffff" }
];

// Coloring stories with instructions
const coloringStories = [
  {
    title: "The Rainbow Garden",
    story: `
      In the garden, there is a big red flower. 
      Next to it grows a small blue flower.
      A yellow butterfly sits on a green leaf.
      The sun in the sky is bright orange.
      A purple bird flies overhead.
      The garden fence is brown.
      A pink worm crawls on the ground.
      A black cat watches from the corner.
    `,
    canvasItems: [
      { name: "big flower", instructions: "Color the big flower red." },
      { name: "small flower", instructions: "Color the small flower blue." },
      { name: "butterfly", instructions: "Color the butterfly yellow." },
      { name: "leaf", instructions: "Color the leaf green." },
      { name: "sun", instructions: "Color the sun orange." },
      { name: "bird", instructions: "Color the bird purple." },
      { name: "fence", instructions: "Color the fence brown." },
      { name: "worm", instructions: "Color the worm pink." },
      { name: "cat", instructions: "Color the cat black." }
    ]
  },
  {
    title: "The Ocean Adventure",
    story: `
      We are on a boat in the ocean.
      The boat is red and white.
      The ocean water is blue.
      There is a green sea turtle swimming.
      A yellow fish jumps out of the water.
      The sky above is light blue.
      Brown seaweed floats in the water.
      A purple jellyfish drifts by.
      The sun is bright orange.
    `,
    canvasItems: [
      { name: "boat", instructions: "Color the boat red and white." },
      { name: "ocean", instructions: "Color the ocean blue." },
      { name: "turtle", instructions: "Color the sea turtle green." },
      { name: "fish", instructions: "Color the fish yellow." },
      { name: "sky", instructions: "Color the sky light blue." },
      { name: "seaweed", instructions: "Color the seaweed brown." },
      { name: "jellyfish", instructions: "Color the jellyfish purple." },
      { name: "sun", instructions: "Color the sun orange." }
    ]
  },
  {
    title: "The Magical Forest",
    story: `
      We are exploring a magical forest.
      The forest has tall green trees.
      Some leaves are yellow and orange.
      A brown owl sits on a branch.
      A red fox runs through the bushes.
      Purple flowers grow on the ground.
      A blue river flows nearby.
      Pink mushrooms dot the forest floor.
      The sky above is light blue.
    `,
    canvasItems: [
      { name: "trees", instructions: "Color the trees green." },
      { name: "leaves", instructions: "Color some leaves yellow and orange." },
      { name: "owl", instructions: "Color the owl brown." },
      { name: "fox", instructions: "Color the fox red." },
      { name: "flowers", instructions: "Color the flowers purple." },
      { name: "river", instructions: "Color the river blue." },
      { name: "mushrooms", instructions: "Color the mushrooms pink." },
      { name: "sky", instructions: "Color the sky light blue." }
    ]
  }
];

const ReadAndColor = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0].value);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    contextRef.current = context;
    
    // Draw the base scene
    drawBaseScene();
    
    // Reset completed items
    setCompletedItems([]);
  }, [currentStoryIndex]);
  
  const drawBaseScene = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    
    // Draw light background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    
    // Draw some basic outlines based on the current story
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const story = coloringStories[currentStoryIndex];
    
    // Draw simple outlines for the items mentioned in the story
    const currentStory = coloringStories[currentStoryIndex];
    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    
    ctx.beginPath();
    ctx.rect(10, 10, canvas.width / 2 - 20, canvas.height / 2 - 20);
    ctx.stroke();
    
    // Draw basic shapes for items
    story.canvasItems.forEach((item, index) => {
      const x = 50 + (index % 3) * 120;
      const y = 50 + Math.floor(index / 3) * 100;
      
      ctx.beginPath();
      
      // Draw different shapes based on item name
      if (item.name.includes("flower")) {
        // Draw a simple flower
        const petalSize = item.name.includes("big") ? 20 : 15;
        
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const pX = x + Math.cos(angle) * petalSize;
          const pY = y + Math.sin(angle) * petalSize;
          
          ctx.beginPath();
          ctx.ellipse(pX, pY, petalSize / 2, petalSize / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Center of flower
        ctx.beginPath();
        ctx.arc(x, y, petalSize / 3, 0, Math.PI * 2);
        ctx.stroke();
      } 
      else if (item.name.includes("butterfly")) {
        // Draw butterfly
        ctx.beginPath();
        ctx.ellipse(x - 10, y - 5, 15, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 10, y - 5, 15, 10, 0, 0, Math.PI * 2);
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        ctx.stroke();
      }
      else if (item.name.includes("leaf")) {
        // Draw leaf
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 10, Math.PI / 4, 0, Math.PI * 2);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 15, y + 15);
        ctx.stroke();
      }
      else if (item.name.includes("sun")) {
        // Draw sun
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // Sun rays
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(angle) * 20, y + Math.sin(angle) * 20);
          ctx.lineTo(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30);
          ctx.stroke();
        }
      }
      else if (item.name.includes("bird")) {
        // Draw bird
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.moveTo(x + 15, y);
        ctx.lineTo(x + 25, y - 5);
        ctx.lineTo(x + 15, y + 5);
        ctx.closePath();
        ctx.stroke();
      }
      else if (item.name.includes("fence")) {
        // Draw fence
        ctx.beginPath();
        ctx.moveTo(x - 30, y);
        ctx.lineTo(x + 30, y);
        ctx.moveTo(x - 20, y - 15);
        ctx.lineTo(x - 20, y + 15);
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.moveTo(x + 20, y - 15);
        ctx.lineTo(x + 20, y + 15);
        ctx.stroke();
      }
      else if (item.name.includes("worm")) {
        // Draw worm
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.bezierCurveTo(x - 10, y - 10, x + 10, y + 10, x + 20, y);
        ctx.stroke();
      }
      else if (item.name.includes("cat")) {
        // Draw cat
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.moveTo(x - 15, y - 10);
        ctx.lineTo(x - 25, y - 20);
        ctx.moveTo(x + 15, y - 10);
        ctx.lineTo(x + 25, y - 20);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 5);
        ctx.moveTo(x - 5, y + 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.stroke();
      }
      else if (item.name.includes("boat")) {
        // Draw boat
        ctx.beginPath();
        ctx.moveTo(x - 30, y + 10);
        ctx.lineTo(x + 30, y + 10);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x - 20, y);
        ctx.closePath();
        ctx.stroke();
        
        // Mast
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 30);
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + 20, y - 15);
        ctx.lineTo(x, y - 15);
        ctx.stroke();
      }
      else if (item.name.includes("ocean") || item.name.includes("river")) {
        // Draw water
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          ctx.moveTo(x - 30, y + i * 10);
          ctx.bezierCurveTo(
            x - 15, y - 5 + i * 10,
            x + 15, y + 5 + i * 10,
            x + 30, y + i * 10
          );
        }
        ctx.stroke();
      }
      else if (item.name.includes("turtle")) {
        // Draw turtle
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.moveTo(x + 15, y);
        ctx.lineTo(x + 25, y);
        ctx.moveTo(x - 15, y - 10);
        ctx.lineTo(x - 25, y - 15);
        ctx.moveTo(x - 15, y + 10);
        ctx.lineTo(x - 25, y + 15);
        ctx.stroke();
      }
      else if (item.name.includes("fish")) {
        // Draw fish
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 10, 0, 0, Math.PI * 2);
        ctx.moveTo(x + 20, y);
        ctx.lineTo(x + 30, y - 10);
        ctx.lineTo(x + 30, y + 10);
        ctx.closePath();
        ctx.stroke();
      }
      else if (item.name.includes("sky")) {
        // Draw sky with clouds
        ctx.beginPath();
        ctx.arc(x - 10, y, 10, 0, Math.PI * 2);
        ctx.arc(x, y - 5, 15, 0, Math.PI * 2);
        ctx.arc(x + 15, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      else if (item.name.includes("seaweed")) {
        // Draw seaweed
        ctx.beginPath();
        for (let i = 0; i < 2; i++) {
          ctx.moveTo(x - 10 + i * 20, y + 20);
          ctx.bezierCurveTo(
            x - 20 + i * 20, y + 10,
            x + i * 20, y,
            x - 10 + i * 20, y - 20
          );
        }
        ctx.stroke();
      }
      else if (item.name.includes("jellyfish")) {
        // Draw jellyfish
        ctx.beginPath();
        ctx.arc(x, y - 10, 15, Math.PI, 0, false);
        ctx.moveTo(x - 15, y - 10);
        ctx.lineTo(x - 10, y + 20);
        ctx.moveTo(x - 5, y - 10);
        ctx.lineTo(x - 5, y + 15);
        ctx.moveTo(x + 5, y - 10);
        ctx.lineTo(x + 5, y + 15);
        ctx.moveTo(x + 15, y - 10);
        ctx.lineTo(x + 10, y + 20);
        ctx.stroke();
      }
      else if (item.name.includes("trees")) {
        // Draw trees
        for (let i = 0; i < 2; i++) {
          const treeX = x - 20 + i * 40;
          ctx.beginPath();
          ctx.moveTo(treeX, y + 20);
          ctx.lineTo(treeX, y - 10);
          ctx.lineTo(treeX - 15, y - 10);
          ctx.lineTo(treeX, y - 20);
          ctx.lineTo(treeX + 15, y - 10);
          ctx.lineTo(treeX, y - 10);
          ctx.stroke();
        }
      }
      else if (item.name.includes("leaves")) {
        // Draw leaves
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(x - 20 + i * 20, y, 10, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      else if (item.name.includes("owl")) {
        // Draw owl
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.arc(x - 8, y - 5, 5, 0, Math.PI * 2);
        ctx.arc(x + 8, y - 5, 5, 0, Math.PI * 2);
        ctx.moveTo(x - 5, y + 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.stroke();
      }
      else if (item.name.includes("fox")) {
        // Draw fox
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 10, 0, 0, Math.PI * 2);
        ctx.moveTo(x + 20, y);
        ctx.lineTo(x + 30, y - 5);
        ctx.lineTo(x + 35, y);
        ctx.moveTo(x + 20, y);
        ctx.lineTo(x + 30, y + 5);
        ctx.lineTo(x + 35, y);
        ctx.moveTo(x - 15, y - 8);
        ctx.lineTo(x - 10, y - 15);
        ctx.moveTo(x - 5, y - 8);
        ctx.lineTo(x, y - 15);
        ctx.stroke();
      }
      else if (item.name.includes("flowers")) {
        // Draw flowers
        for (let i = 0; i < 2; i++) {
          const flowerX = x - 15 + i * 30;
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j / 5) * Math.PI * 2;
            const pX = flowerX + Math.cos(angle) * 8;
            const pY = y + Math.sin(angle) * 8;
            ctx.ellipse(pX, pY, 4, 4, 0, 0, Math.PI * 2);
          }
          ctx.arc(flowerX, y, 3, 0, Math.PI * 2);
          ctx.moveTo(flowerX, y + 8);
          ctx.lineTo(flowerX, y + 20);
          ctx.stroke();
        }
      }
      else if (item.name.includes("mushrooms")) {
        // Draw mushrooms
        for (let i = 0; i < 2; i++) {
          const mushX = x - 15 + i * 30;
          ctx.beginPath();
          ctx.moveTo(mushX, y);
          ctx.lineTo(mushX, y + 15);
          ctx.moveTo(mushX - 10, y);
          ctx.arc(mushX, y, 10, Math.PI, 0, true);
          ctx.stroke();
        }
      }
      else {
        // Draw a simple rectangle for other items
        ctx.rect(x - 20, y - 15, 40, 30);
        ctx.stroke();
      }
      
      // Add label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      const labelY = y + 30;
      ctx.fillText(item.name, x - ctx.measureText(item.name).width / 2, labelY);
    });
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    
    contextRef.current.strokeStyle = selectedColor;
    contextRef.current.fillStyle = selectedColor;
    contextRef.current.lineWidth = 12;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    
    setIsDrawing(true);
  };
  
  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Check if any coloring instructions have been completed
    checkCompletedItems();
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * 2);
    const scaleY = canvas.height / (rect.height * 2);
    
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY
    };
  };
  
  const checkCompletedItems = () => {
    // This is a simplified check - in a real app, you'd use image analysis
    // For now, we'll just mark an item as completed when the user uses the appropriate color
    
    const story = coloringStories[currentStoryIndex];
    const newCompletedItems = [...completedItems];
    let newItemsCompleted = false;
    
    story.canvasItems.forEach(item => {
      // Skip if already completed
      if (completedItems.includes(item.name)) return;
      
      // Check if the current color matches the instruction
      const instructions = item.instructions.toLowerCase();
      const colorName = colors.find(c => c.value === selectedColor)?.name || "";
      
      if (instructions.includes(colorName)) {
        newCompletedItems.push(item.name);
        newItemsCompleted = true;
        
        toast({
          title: "Good job!",
          description: `You colored the ${item.name} ${colorName}!`,
        });
      }
    });
    
    if (newItemsCompleted) {
      setCompletedItems(newCompletedItems);
      
      // Check if all items are completed
      if (newCompletedItems.length === story.canvasItems.length) {
        setShowConfetti(true);
        audioService.speak("Great job! You completed the coloring page!");
        
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        audioService.playSound('success');
      }
    }
  };
  
  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    drawBaseScene();
    setCompletedItems([]);
    
    toast({
      title: "Canvas cleared",
      description: "Start coloring again!",
    });
  };
  
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.href = image;
    link.download = `${coloringStories[currentStoryIndex].title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
    
    toast({
      title: "Image downloaded",
      description: "Your coloring has been saved as an image!",
    });
  };
  
  const readStory = () => {
    audioService.speak(coloringStories[currentStoryIndex].story, false);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-teal-100 to-blue-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-teal-700">Read and Color</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                const nextIndex = (currentStoryIndex + 1) % coloringStories.length;
                setCurrentStoryIndex(nextIndex);
              }}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Next Story
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{coloringStories[currentStoryIndex].title}</h2>
              
              <Button 
                variant="ghost" 
                onClick={readStory}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Read Aloud
              </Button>
            </div>
            
            <div className="p-4 bg-teal-50 rounded-lg mb-4 max-h-60 overflow-y-auto">
              <p className="whitespace-pre-line">{coloringStories[currentStoryIndex].story}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Coloring Instructions:</h3>
              <ul className="space-y-2">
                {coloringStories[currentStoryIndex].canvasItems.map((item, index) => (
                  <li 
                    key={index}
                    className={`flex items-center ${
                      completedItems.includes(item.name) 
                        ? 'text-green-600 line-through' 
                        : ''
                    }`}
                  >
                    <span className="mr-2">
                      {completedItems.includes(item.name) ? '✓' : '○'}
                    </span>
                    {item.instructions}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Coloring Canvas</h2>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearCanvas}
                  className="flex items-center gap-2"
                >
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={downloadImage}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            
            {/* Color palette */}
            <div className="flex flex-wrap gap-2 mb-4">
              {colors.map(color => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-teal-500' 
                      : ''
                  }`}
                  style={{ backgroundColor: color.value, border: '1px solid #ddd' }}
                  onClick={() => setSelectedColor(color.value)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
            
            {/* Canvas */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                className="w-full h-80 cursor-crosshair"
              />
            </div>
            
            {completedItems.length === coloringStories[currentStoryIndex].canvasItems.length && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                <p className="text-green-800 font-bold">You completed the coloring page!</p>
                <Button
                  onClick={() => {
                    const nextIndex = (currentStoryIndex + 1) % coloringStories.length;
                    setCurrentStoryIndex(nextIndex);
                  }}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  Try Another Story
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Read the story or click "Read Aloud" to hear it</li>
            <li>Follow the coloring instructions in the list</li>
            <li>Select a color from the palette, then color the matching items</li>
            <li>Complete all the coloring instructions to finish</li>
            <li>Click "Save" to download your finished picture</li>
            <li>Click "Next Story" to try a different coloring page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReadAndColor;
