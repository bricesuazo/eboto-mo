import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};
const InterRegular = fetch(
  new URL("../../../public/assets/font/INTER__.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const InterBold = fetch(
  new URL("../../../public/assets/font/INTERBOLD__.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function (req: NextRequest) {
  const fontInterRegular = await InterRegular;
  const fontInterBold = await InterBold;
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const NotFoundPage = () => {
    return new ImageResponse(<div>404</div>, {
      width: 1200,
      height: 600,
    });
  };
  if (!type) {
    return NotFoundPage();
  }
  switch (type) {
    case "candidate":
      const fullName = searchParams.get("fullName");
      const electionUid = searchParams.get("election");
      const candidateUid = searchParams.get("candidate");
      const position = searchParams.get("position");
      if (!fullName || !position) {
        return NotFoundPage();
      }
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              fontFamily: '"Inter Bold"',
            }}
          >
            <img
              src="https://eboto-mo.com/assets/images/cvsu-front.jpg"
              alt=""
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: 0,
                filter: "brightness(0.35)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={
                  !electionUid && !candidateUid
                    ? "https://eboto-mo.com/_next/image?url=%2Fassets%2Fimages%2Fdefault-profile-picture.png&w=1920&q=75"
                    : `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/elections%2F${electionUid}%2Fcandidates%2F${candidateUid}%2Fphoto?alt=media`
                }
                alt={`${fullName}'s photo`}
                style={{
                  width: 256,
                  height: 256,
                  boxShadow: "1px -1px 76px 1px rgba(0,0,0,0.25)",
                  marginRight: 32,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "white",
                }}
              >
                <p style={{ fontSize: 42, fontWeight: "bold", lineHeight: -2 }}>
                  {fullName}
                </p>
                <p
                  style={{
                    fontSize: 24,
                    fontFamily: '"Inter Regular"',
                    lineHeight: -2,
                  }}
                >
                  Running for {position}
                </p>
                <p
                  style={{
                    backgroundColor: "#459845",
                    color: "white",
                    fontFamily: "Inter Bold",
                    width: 156,
                    height: 38,
                    borderRadius: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  See credentials
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <p style={{ color: "#ffde59", fontWeight: "bold", fontSize: 18 }}>
                eBoto Mo
              </p>
              <img
                src="https://eboto-mo.com/_next/image?url=%2Fassets%2Fimages%2Feboto-mo-logo.png&w=64&q=75"
                alt="eBoto Mo Logo"
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: 8,
                  filter: "invert(1)",
                }}
              />
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 600,
          fonts: [
            {
              name: "Inter Regular",
              data: fontInterRegular,
              style: "normal",
            },
            {
              name: "Inter Bold",
              data: fontInterBold,
              style: "normal",
            },
          ],
        }
      );
    case "election":
      const electionName = searchParams.get("electionName");
      const electionStartDate = searchParams.get("electionStartDate");
      const electionEndDate = searchParams.get("electionEndDate");
      const electionLogoUrl = searchParams.get("electionLogoUrl");
      if (!electionName || !electionStartDate || !electionEndDate) {
        return NotFoundPage();
      }
      return new ImageResponse(
        (
          // <div style={{ display: "flex" }}>
          //   <p>{electionName}</p>
          //   <p>{electionStartDate}</p>
          //   <p>{electionEndDate}</p>
          //   <p>{electionLogoUrl && electionLogoUrl}</p>
          // </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              fontFamily: '"Inter Bold"',
              color: "white",
            }}
          >
            <img
              src="https://eboto-mo.com/assets/images/cvsu-front.jpg"
              alt=""
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: 0,
                filter: "brightness(0.35)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                marginTop: 16,
              }}
            >
              <img
                src={
                  !electionLogoUrl
                    ? "https://eboto-mo.com/_next/image?url=%2Fassets%2Fimages%2Fdefault-election-logo.png&w=1920&q=75"
                    : electionLogoUrl
                }
                alt={`${electionName}'s photo`}
                style={{
                  width: 164,
                  height: 164,
                  boxShadow: "1px -1px 76px 1px rgba(0,0,0,0.25)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 48,
                  lineHeight: -3.5,
                }}
              >
                <p style={{ fontSize: 42, fontWeight: "bold" }}>
                  {electionName}
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontFamily: '"Inter Regular"',
                  }}
                >
                  {electionStartDate} - {electionEndDate}
                </p>
                <p
                  style={{
                    backgroundColor: "#459845",
                    color: "white",
                    fontFamily: "Inter Bold",
                    width: 156,
                    height: 38,
                    borderRadius: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  See information
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <p style={{ color: "#ffde59", fontWeight: "bold", fontSize: 18 }}>
                eBoto Mo
              </p>
              <img
                src="https://eboto-mo.com/_next/image?url=%2Fassets%2Fimages%2Feboto-mo-logo.png&w=64&q=75"
                alt="eBoto Mo Logo"
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: 8,
                  filter: "invert(1)",
                }}
              />
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 600,
          fonts: [
            {
              name: "Inter Regular",
              data: fontInterRegular,
              style: "normal",
            },
            {
              name: "Inter Bold",
              data: fontInterBold,
              style: "normal",
            },
          ],
        }
      );
  }
}
