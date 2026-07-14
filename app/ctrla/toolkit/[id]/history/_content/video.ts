import type { ToolkitHistory } from "../../../../data";

// ═══════════════════════════════════════════════════════
// VIDEO / FILM — A HISTORY
// How light got caught. The science and the machines: optics, film
// chemistry, the roll, formats, mechanisms, sensors.
// ═══════════════════════════════════════════════════════

export const videoHistory: ToolkitHistory = {
  entryLabel: "A history lesson",
  title: "How light got caught.",
  lede: "A camera is just a box that catches light, and a film is just light remembered. The whole history of the medium is a chase after one question: how do you catch light, hold it, and play it back. Here is the science, and the machines that cracked it.",
  moments: [
    {
      era: "1600s",
      title: "The camera obscura",
      hook: "Point light through a tiny hole into a dark room and the whole world appears, upside down, on the far wall. Every camera ever built is a refinement of that one trick.",
      motif: "vid-pinhole",
      body: "Known for over two thousand years, the camera obscura proved that light travels in straight lines: a small aperture flips the scene onto the opposite surface. Renaissance painters used it to trace reality. It had no way to keep the image, but it revealed the principle under everything that followed.",
      whyItMattered: "A lens, an aperture, a sensor, it is all still a dark box and a hole letting light in. Understand that and you understand every camera in the kit.",
    },
    {
      era: "1826",
      title: "Fixing the light",
      hook: "Niepce needed an eight hour exposure to keep the first photograph. Then Daguerre cut it to minutes with silver and mercury, and light could be frozen.",
      motif: "vid-plate",
      body: "Joseph Niepce made the first surviving photograph on a bitumen plate around 1826, an exposure so long the sun lit both sides of the courtyard. Louis Daguerre then used silver iodide and mercury vapor for sharp images in minutes, while Fox Talbot invented the negative, so one exposure could make endless prints.",
      whyItMattered: "Capturing an image was never about the box, it was the chemistry that remembers the light. That negative and print idea is still exactly how film works.",
    },
    {
      era: "1888",
      title: "The roll of film",
      hook: "George Eastman put light-sensitive emulsion on a flexible strip, wound it into a roll, and told the world, you press the button, we do the rest.",
      motif: "vid-roll",
      quote: { text: "You press the button, we do the rest.", attribution: "Kodak, 1888" },
      body: "Before Kodak, photography meant fragile glass plates and a portable darkroom. Eastman coated celluloid with emulsion and rolled it up. Early film was cellulose nitrate, brilliant but dangerously flammable, later replaced by acetate safety film.",
      whyItMattered: "No roll of film, no cinema. A long flexible strip that could run past a lens is the physical foundation of everything the video kit does.",
    },
    {
      era: "1891",
      title: "35mm and the machine that moves it",
      hook: "Edison's team slit Eastman's roll to 35 millimeters and punched four holes per frame. That gauge became the standard for a hundred years.",
      motif: "vid-claw",
      body: "William Dickson standardized 35mm film with four perforations per frame, and the Lumieres built a camera light enough to also project. The mechanism is a marvel: a claw pulls each frame into place, holds it still while the shutter opens, then yanks the next one down, dozens of times a second.",
      whyItMattered: "Motion is really stillness, repeated fast. This mechanism is the engine of cinema, and understanding it is understanding why film looks the way it does.",
    },
    {
      era: "The science",
      title: "Persistence of vision",
      hook: "Your eye holds each frame for a fraction of a second after it is gone. Show 24 a second and your brain fills the gaps with motion that was never there.",
      motif: "vid-frames",
      interactive: "fpsscrub",
      body: "Film does not move. It is a rapid series of still frames, and the mind stitches them together through persistence of vision and the phi phenomenon. 24 frames a second became the standard, enough to feel smooth, few enough to be affordable. The shutter's on-off flicker and the resulting motion blur are part of what we read as cinematic.",
      whyItMattered: "Frame rate is a creative choice, not a fixed law. Knowing why 24 feels like film and 60 feels like video is knowing how to control the feel of a shot.",
    },
    {
      era: "The science",
      title: "The exposure triangle",
      hook: "Three dials control every image ever made: how wide the hole opens, how long it stays open, and how sensitive the film is. Drag the aperture below.",
      motif: "vid-iris",
      interactive: "aperture",
      body: "Aperture, the iris inside the lens, sets how much light enters and how much of the scene is in focus, that shallow blurred background is a wide aperture. Shutter speed sets how long the sensor drinks the light, freezing or blurring motion. Film speed, later ISO, sets sensitivity. Every exposure is a balance of the three against the light in the room.",
      whyItMattered: "This is the literal science the video kit is built to reward. Cinematic is not a preset, it is these three numbers chosen on purpose.",
    },
    {
      era: "1932",
      title: "Catching color",
      hook: "Technicolor split the light with a prism and ran three strips of film at once, one each for red, green, and blue, then recombined them in dye.",
      motif: "vid-prism",
      body: "The Technicolor three strip camera used a beam-splitting prism to expose three black and white negatives through colored filters, then printed them back as layered dyes, a process so vivid it still looks unreal. Kodak's Eastmancolor later stacked the color layers into a single strip, and affordable color film took over.",
      whyItMattered: "Color is not a filter you add at the end, it is built into the emulsion and the grade. The kit's finish stage is the modern version of this same science.",
    },
    {
      era: "Formats",
      title: "The gauge wars",
      hook: "8mm for home movies, 16 for news, 35 for cinema, 65 and 70 for spectacle. The wider the strip, the more light and detail it holds. Format is destiny.",
      motif: "vid-gauges",
      body: "Film comes in gauges, and size is image quality. A bigger negative gathers more light and resolves more detail, which is why epics were shot on 65 and 70mm and IMAX went bigger still, while 8mm and Super 8 kept film cheap enough for families.",
      whyItMattered: "Sensor size is the same trade today, and it is why the kit cares about the body behind the glass. Knowing the trade is the difference between choosing a look and stumbling into one.",
    },
    {
      era: "1969",
      title: "From silver to silicon",
      hook: "A pair of scientists at Bell Labs turned light into countable electric charge, and the sensor was born.",
      motif: "vid-sensor",
      body: "In 1969 Willard Boyle and George Smith invented the CCD, later a Nobel prize, a chip that converts light into an electrical signal pixel by pixel. A color filter over the grid, the Bayer pattern, lets it record red, green, and blue. CMOS sensors made it cheap and fast, and cameras like RED brought digital capture to cinema.",
      whyItMattered: "Digital did not change the physics, it changed the recording surface, from a chemical reaction to a silicon count. The exposure triangle, the optics, the framing, all of it still applies.",
    },
    {
      era: "Now",
      title: "The sensor in your pocket",
      hook: "The camera in your phone has a sensor smaller than a fingernail, but stacks dozens of frames with software to rival cameras that cost more than a car.",
      motif: "vid-compute",
      body: "Computational photography merges many exposures into one, pulling detail out of near darkness, while AI now generates footage from a text prompt, no lens or light required. The tiny sensor plus smart math has collapsed the gap the whole history fought to close.",
      whyItMattered: "Same lesson the camera obscura started. The tools for catching light keep getting better and cheaper, so the scarce thing is the eye that knows where to point it and why.",
    },
  ],
  closer: "Light has not changed in a billion years. Everything in this history, the plate, the roll, the prism, the sensor, was just a better way to catch it and hold it still. The science will keep advancing. The eye behind the lens is still the whole job.",
};
