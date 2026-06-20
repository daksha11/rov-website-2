export default function CtrlALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* CTRL-A brand fonts — Gontserrat (display), Franklin Gothic Book (body) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-MediumItalic.ttf') format('truetype'); font-weight: 500; font-style: italic; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-SemiBold.ttf') format('truetype'); font-weight: 600; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-ExtraBold.ttf') format('truetype'); font-weight: 800; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Gontserrat'; src: url('/ctrla/fonts/Gontserrat-Black.ttf') format('truetype'); font-weight: 900; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Franklin Gothic Book'; src: url('/ctrla/fonts/FranklinGothicBook.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Franklin Gothic Book'; src: url('/ctrla/fonts/FranklinGothicBook-Italic.ttf') format('truetype'); font-weight: 400; font-style: italic; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-thin.otf') format('opentype'); font-weight: 100 300; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-book.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-italic.otf') format('opentype'); font-weight: 400; font-style: italic; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-medium.otf') format('opentype'); font-weight: 500; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-semibolditalic.otf') format('opentype'); font-weight: 600; font-style: italic; font-display: swap; }
            @font-face { font-family: 'Neue Montreal'; src: url('/ctrla/fonts/pp-neue-montreal-cufonfonts/ppneuemontreal-bold.otf') format('opentype'); font-weight: 700 900; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Instrument Serif'; src: url('/ctrla/fonts/Instrument_Serif/InstrumentSerif-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
            @font-face { font-family: 'Instrument Serif'; src: url('/ctrla/fonts/Instrument_Serif/InstrumentSerif-Italic.ttf') format('truetype'); font-weight: 400; font-style: italic; font-display: swap; }
          `,
        }}
      />
      {children}
    </>
  );
}
