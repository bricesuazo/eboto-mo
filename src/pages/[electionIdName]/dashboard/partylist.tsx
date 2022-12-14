import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { FlagIcon } from "@heroicons/react/24/outline";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useFirestoreCollectionData } from "reactfire";
import EditPartylistModal from "../../../components/EditPartylistModal";
import { firestore } from "../../../firebase/firebase";
import DashboardLayout from "../../../layout/DashboardLayout";
import { adminType, electionType, partylistType } from "../../../types/typings";
import isAdminOwnsTheElection from "../../../utils/isAdminOwnsTheElection";

const PartylistPage = ({
  election,
  session,
}: {
  election: electionType;
  session: { user: adminType; expires: string };
}) => {
  const { data } = useFirestoreCollectionData(
    query(
      collection(firestore, "elections", election.uid, "partylists"),
      orderBy("createdAt")
    )
  );
  const [partylists, setPartylists] = useState<partylistType[] | null>(null);
  const [selectedPartylist, setSelectedPartylist] =
    useState<partylistType | null>(null);
  useEffect(() => {
    data && setPartylists(data as partylistType[]);
  }, [data]);
  const {
    isOpen: isOpenEditPartylist,
    onOpen: onOpenEditPartylist,
    onClose: onCloseEditPartylist,
  } = useDisclosure();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { colorMode } = useColorMode();
  return (
    <>
      <Head>
        <title>Partylists | eBoto Mo</title>
      </Head>
      {selectedPartylist && (
        <EditPartylistModal
          isOpen={isOpenEditPartylist}
          onClose={onCloseEditPartylist}
          election={election}
          partylist={selectedPartylist}
        />
      )}
      <DashboardLayout title="Partylists" session={session} overflow="auto">
        {!partylists ? (
          <Center>
            <Spinner />
          </Center>
        ) : partylists.length === 0 ? (
          <Center>
            <Text>No partylist</Text>
          </Center>
        ) : (
          <>
            <Flex gap={4} flexWrap="wrap">
              {partylists.map((partylist) => {
                return (
                  <div key={partylist.id}>
                    <Center
                      width={48}
                      height={64}
                      borderRadius="md"
                      cursor="pointer"
                      border="1px"
                      borderColor={`${
                        colorMode === "dark" ? "white" : "black"
                      }Alpha.300`}
                      padding={2}
                      pointerEvents={
                        partylist.abbreviation === "IND" ? "none" : "auto"
                      }
                      userSelect={
                        partylist.abbreviation === "IND" ? "none" : "auto"
                      }
                      color={colorMode === "dark" ? "inherit" : "gray.800"}
                    >
                      <Stack alignItems="center">
                        <Box
                          width={98}
                          height={98}
                          borderRadius="full"
                          overflow="hidden"
                        >
                          <Center height="100%" position="relative">
                            {/* {partylist.logo ? (
                              <>
                                <Image
                                  src={partylist.logo}
                                  alt={partylist.name + " logo"}
                                  objectFit="cover"
                                  fallback={<Spinner size="lg" />}
                                  userSelect="none"
                                  pointerEvents="none"
                                />
                              </>
                            ) : ( */}
                            <FlagIcon
                              style={{
                                border: "2px solid gray.500",

                                padding: 18,
                                borderRadius: "100%",
                              }}
                            />
                            {/* )} */}
                          </Center>
                        </Box>
                        <Text textAlign="center">
                          {partylist.name} ({partylist.abbreviation})
                        </Text>
                        <HStack
                          display={
                            partylist.abbreviation === "IND"
                              ? "none"
                              : "inherit"
                          }
                        >
                          <Button
                            size="sm"
                            width="fit-content"
                            disabled={deleteLoading}
                            onClick={async () => {
                              setSelectedPartylist(partylist);
                              onOpenEditPartylist();
                            }}
                          >
                            Edit
                          </Button>
                          <Popover>
                            {({
                              onClose: onCloseDeleteModal,
                            }: {
                              onClose: () => void;
                            }) => (
                              <>
                                <PopoverTrigger>
                                  <WrapItem>
                                    <Button
                                      size="sm"
                                      width="fit-content"
                                      disabled={deleteLoading}
                                    >
                                      Delete
                                    </Button>
                                  </WrapItem>
                                </PopoverTrigger>
                                <PopoverContent width="100%">
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverHeader>
                                    Delete partylist?
                                  </PopoverHeader>
                                  <PopoverBody>
                                    <HStack>
                                      <Button
                                        onClick={onCloseDeleteModal}
                                        disabled={deleteLoading}
                                        size="sm"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={async () => {
                                          setDeleteLoading(true);
                                          await deleteDoc(
                                            doc(
                                              firestore,
                                              "elections",
                                              election.uid,
                                              "partylists",
                                              partylist.uid
                                            )
                                          );
                                          onCloseDeleteModal();
                                          setDeleteLoading(false);
                                        }}
                                        isLoading={deleteLoading}
                                        colorScheme="red"
                                        size="sm"
                                      >
                                        Delete
                                      </Button>
                                    </HStack>
                                  </PopoverBody>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        </HStack>
                      </Stack>
                    </Center>
                  </div>
                );
              })}
            </Flex>
          </>
        )}
      </DashboardLayout>
    </>
  );
};

export default PartylistPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const session = await getSession(context);
    const electionSnapshot = await getDocs(
      query(
        collection(firestore, "elections"),
        where("electionIdName", "==", context.query.electionIdName)
      )
    );
    if (electionSnapshot.empty || !session) {
      return {
        notFound: true,
      };
    }
    if (!isAdminOwnsTheElection(session, electionSnapshot.docs[0].id)) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
    return {
      props: {
        session: await getSession(context),
        election: JSON.parse(JSON.stringify(electionSnapshot.docs[0].data())),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
