import React from "react";

const Cards: React.FC = () => {
  const sections = [
    {
      id: 1,
      title: "Friction/Output",
      content:
        "So what exactly is the number one thing holding artists back from reaching their max output potential? Friction. Whether that's mixing, mastering, designing cover arts, visualizers. It all becomes overwhelming without a team or a budget, until now."
    },
    {
      id: 2,
      title: "Mixing/Mastering",
      content:
        "Artists without a large team, or budget behind them often find themselves struggling to connect with an engineer that will cater to their needs, or spend hours of their own time mixing. That is what we call friction. We are here to eliminate that at a fraction of the cost."
    },
    {
      id: 3,
      title: "Graphic Design",
      content:
        "Cover arts. Visualizers. Video Editing. So many artists find this step to be difficult, and it is. To record content, design cover arts, edit, is quite the hassle. Without a proper team, this step often hold back artists from putting out art as frequently. Friction. We are here to eliminate that at a fraction of the cost."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-10">BRIDGING THE GAP/FRICTION</h1>
      <div className="space-y-10">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white text-black rounded-none shadow-lg p-8 flex items-center"
          >
            <div className="text-9xl font-bold text-black mr-16">{section.id}</div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              <p className="text-lg">{section.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;