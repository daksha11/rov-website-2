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
          `,
        }}
      />
      {children}
    </>
  );
}
