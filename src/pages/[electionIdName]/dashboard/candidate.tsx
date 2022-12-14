import {
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
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
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useFirestoreCollectionData } from "reactfire";
import AddCandidateModal from "../../../components/AddCandidateModal";
import EditCandidateModal from "../../../components/EditCandidateModal";
import { firestore, storage } from "../../../firebase/firebase";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
  adminType,
  candidateType,
  electionType,
  partylistType,
  positionType,
} from "../../../types/typings";
import isAdminOwnsTheElection from "../../../utils/isAdminOwnsTheElection";

const CandidatePage = ({
  election,
  partylists,
  positions,
  session,
}: {
  election: electionType;
  partylists: partylistType[];
  positions: positionType[];
  session: { user: adminType; expires: string };
}) => {
  const { data } = useFirestoreCollectionData(
    collection(firestore, "elections", election.uid, "candidates")
  );
  const [candidates, setCandidates] = useState<candidateType[] | null>();
  const [selectedCandidate, setSelectedCandidate] = useState<candidateType>();
  useEffect(() => {
    data && setCandidates(data as candidateType[]);
  }, [data]);
  const {
    isOpen: isOpenEditCandidate,
    onOpen: onOpenEditCandidate,
    onClose: onCloseEditCandidate,
  } = useDisclosure();
  const {
    isOpen: isOpenAddCandidate,
    onOpen: onOpenAddCandidate,
    onClose: onCloseAddCandidate,
  } = useDisclosure();

  const [selectedPosition, setSelectedPosition] = useState<positionType>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  return (
    <>
      <Head>
        <title>Candidates | eBoto Mo</title>
      </Head>
      {selectedPosition && (
        <AddCandidateModal
          isOpen={isOpenAddCandidate}
          onClose={onCloseAddCandidate}
          election={election}
          partylists={partylists}
          position={selectedPosition}
        />
      )}
      {selectedCandidate && (
        <EditCandidateModal
          isOpen={isOpenEditCandidate}
          onClose={onCloseEditCandidate}
          election={election}
          partylists={partylists}
          positions={positions}
          candidate={selectedCandidate}
        />
      )}
      <DashboardLayout title="Candidates" overflow="auto" session={session}>
        {!candidates ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Stack spacing={4}>
            {positions.map((position) => {
              return (
                <Flex key={position.id}>
                  <Stack direction={["column", "column", "row"]} width="full">
                    <Flex width={["auto", "auto", "10rem"]} alignItems="center">
                      <Text fontWeight="bold">{position.title}</Text>
                    </Flex>

                    <Flex gap={2} width="full">
                      <Stack
                        width={["4rem", "5rem", "10rem"]}
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        border="1px solid"
                        borderColor="gray.200"
                        paddingX={4}
                        paddingY={2}
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedPosition(position);
                          onOpenAddCandidate();
                        }}
                        userSelect="none"
                      >
                        <Icon as={UserPlusIcon} fontSize="xl" />
                        <Text
                          fontSize="2xs"
                          display={["none", "inherit", "none"]}
                        >
                          Add candidate
                        </Text>
                        <Flex
                          direction="column"
                          display={["none", "none", "inherit"]}
                        >
                          <Text fontSize={["2xs", "2xs", "xs"]}>
                            Add candidate in
                          </Text>
                          <Text fontSize="sm">{position.title}</Text>
                        </Flex>
                      </Stack>

                      <Flex
                        overflowX="auto"
                        gap={2}
                        alignItems="center"
                        width="max-content"
                      >
                        {candidates.filter(
                          (candidate) => candidate.position === position.uid
                        ).length === 0 ? (
                          <Center
                            width={["8rem", "10rem"]}
                            paddingX={4}
                            paddingY={2}
                          >
                            <Text textAlign="center" fontSize={["xs", "sm"]}>
                              No candidate in {position.title}
                            </Text>
                          </Center>
                        ) : (
                          candidates
                            .filter(
                              (candidate) => candidate.position === position.uid
                            )
                            .map((candidate) => {
                              return (
                                <Stack
                                  key={candidate.id}
                                  width={["10rem", "12rem"]}
                                  minWidth="max-content"
                                  height="full"
                                  paddingX={4}
                                  paddingY={2}
                                  border="1px solid"
                                  borderColor="gray.200"
                                  borderRadius="lg"
                                >
                                  <Center position="relative">
                                    {candidate.photoUrl ? (
                                      <>
                                        <Image
                                          src={candidate.photoUrl}
                                          alt={
                                            candidate.firstName +
                                            " " +
                                            candidate.lastName +
                                            " photo"
                                          }
                                          width="54px"
                                          height="54px"
                                          borderRadius="full"
                                          objectFit="cover"
                                          fallback={<Spinner size="lg" />}
                                          userSelect="none"
                                          pointerEvents="none"
                                        />
                                      </>
                                    ) : (
                                      <UserCircleIcon
                                        style={{
                                          width: "54px",
                                          borderRadius: "100%",
                                        }}
                                      />
                                    )}
                                  </Center>
                                  <Text fontSize="sm" textAlign="center">{`${
                                    candidate.lastName
                                  }, ${candidate.firstName}${
                                    candidate.middleName &&
                                    " " + candidate.middleName?.charAt(0) + "."
                                  }`}</Text>

                                  <HStack justifyContent="center">
                                    <Button
                                      size="xs"
                                      onClick={() => {
                                        setSelectedCandidate(candidate);
                                        onOpenEditCandidate();
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
                                                size="xs"
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
                                            <PopoverHeader fontSize="xs">
                                              Delete candidate?
                                            </PopoverHeader>
                                            <PopoverBody>
                                              <HStack>
                                                <Button
                                                  onClick={onCloseDeleteModal}
                                                  disabled={deleteLoading}
                                                  size="xs"
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  onClick={async () => {
                                                    setDeleteLoading(true);
                                                    if (
                                                      candidate.photoUrl?.length
                                                    ) {
                                                      const photoRef = ref(
                                                        storage,
                                                        `elections/${election.uid}/candidates/${candidate.uid}/photo`
                                                      );
                                                      await deleteObject(
                                                        ref(photoRef)
                                                      );
                                                    }
                                                    await deleteDoc(
                                                      doc(
                                                        firestore,
                                                        "elections",
                                                        election.uid,
                                                        "candidates",
                                                        candidate.uid
                                                      )
                                                    );
                                                    onCloseDeleteModal();
                                                    setDeleteLoading(false);
                                                  }}
                                                  isLoading={deleteLoading}
                                                  colorScheme="red"
                                                  size="xs"
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
                              );
                            })
                        )}
                      </Flex>
                    </Flex>
                  </Stack>
                </Flex>
              );
            })}
          </Stack>
        )}
      </DashboardLayout>
    </>
  );
};

export default CandidatePage;

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

    const partylistSnapshot = await getDocs(
      query(
        collection(
          firestore,
          "elections",
          electionSnapshot.docs[0].data().uid,
          "partylists"
        ),
        orderBy("createdAt")
      )
    );
    const partylists: partylistType[] = partylistSnapshot.docs.map(
      (doc) => doc.data() as partylistType
    );

    const positionSnapshot = await getDocs(
      query(
        collection(
          firestore,
          "elections",
          electionSnapshot.docs[0].data().uid,
          "positions"
        ),
        orderBy("order")
      )
    );
    const positions: positionType[] = positionSnapshot.docs.map(
      (doc) => doc.data() as positionType
    );

    return {
      props: {
        election: JSON.parse(JSON.stringify(electionSnapshot.docs[0].data())),
        partylists: JSON.parse(JSON.stringify(partylists)),
        positions: JSON.parse(JSON.stringify(positions)),
        session: await getSession(context),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
