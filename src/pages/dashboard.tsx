import { firestore } from "../firebase/firebase";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { doc, getDoc } from "firebase/firestore";
import { getSession } from "next-auth/react";

const DashboardPage = () => {
  return <>DashboardPage</>;
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  } else if (session.user.accountType === "voter") {
    const electionSnap = await getDoc(
      doc(firestore, "elections", session.user.election)
    );
    const election = electionSnap.data();
    return {
      redirect: {
        destination: `/${election?.electionIdName}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
