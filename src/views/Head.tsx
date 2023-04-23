import NextHead from 'next/head'

const analyze = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-EYSPMQXET5');

`

export default function Head() {
  return (
    <>
      <NextHead>
        <title>Combo</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.72" />
        {/* <meta name="viewport" content="minimum-scale=1, maximum-scale=1, user-scalable=no" /> */}
        {/* <meta name="viewport" content="user-scalable=no" /> */}
        {/* <link rel="icon" href="/images/common/rel_icon.svg" /> */}
        {/*<link rel="icon" href="/images/common/logo_rel.svg" />*/}
      </NextHead>
      {/*<Script src={'https://www.googletagmanager.com/gtag/js?id=G-EYSPMQXET5'} />*/}
      {/*<Script dangerouslySetInnerHTML={{ __html: analyze }} />*/}
    </>
  )
}
