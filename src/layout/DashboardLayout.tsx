import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Select,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter as useRouterNavigation } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useFirestoreCollectionData } from "reactfire";
import AddPartylistModal from "../components/AddPartylistModal";
import AddPositionModal from "../components/AddPositionModal";
import AddVoterModal from "../components/AddVoterModal";
import CreateElectionModal from "../components/CreateElectionModal";
import DashboardSidebar, {
  dashboardSidebar,
} from "../components/DashboardSidebar";
import UploadBulkVotersModal from "../components/UploadBulkVotersModal";
import { firestore } from "../firebase/firebase";
import { adminType, electionType } from "../types/typings";

const DashboardLayout = ({
  children,
  title,
  overflow,
  session,
}: {
  children: any;
  title: string;
  overflow?: string;
  session: { user: adminType; expires: string };
}) => {
  const router = useRouter();
  const routerNavigation = useRouterNavigation();
  // Reloads the page when router changes
  // useEffect(() => {
  //   currentElection?.electionIdName === router.query.electionIdName &&
  //     routerNavigation.refresh();
  // }, [router.query.electionIdName]);
  const {
    isOpen: isOpenCreateElection,
    onOpen: onOpenCreateElection,
    onClose: onCloseCreateElection,
  } = useDisclosure();
  const {
    isOpen: isOpenAddPartylist,
    onOpen: onOpenAddPartylist,
    onClose: onCloseAddPartylist,
  } = useDisclosure();
  const {
    isOpen: isOpenAddPosition,
    onOpen: onOpenAddPosition,
    onClose: onCloseAddPosition,
  } = useDisclosure();

  const {
    isOpen: isOpenAddVoter,
    onOpen: onOpenAddVoter,
    onClose: onCloseAddVoter,
  } = useDisclosure();
  const {
    isOpen: isOpenUploadBulkVoter,
    onOpen: onOpenUploadBulkVoter,
    onClose: onCloseUploadBulkVoter,
  } = useDisclosure();

  const [elections, setElections] = useState<electionType[]>();
  const [currentElection, setCurrentElection] = useState<electionType>();

  const { colorMode } = useColorMode();
  const { data } = useFirestoreCollectionData(
    query(
      collection(firestore, "elections"),
      where("uid", "in", session.user.elections)
    )
  );

  useEffect(() => {
    setElections(data as electionType[]);
  }, [data]);

  useEffect(() => {
    setCurrentElection(
      elections?.find(
        (election) => election.electionIdName === router.query.electionIdName
      )
    );

    if (elections?.length === 0) {
      router.push("/create-election");
    }
    // if (
    //   currentElection &&
    //   session.user.elections.includes(currentElection.uid)
    // ) {
    //   router.replace("/dashboard");
    // }
  }, [elections]);

  return (
    <>
      <CreateElectionModal
        isOpen={isOpenCreateElection}
        onClose={onCloseCreateElection}
      />
      <AddPartylistModal
        election={currentElection as electionType}
        isOpen={isOpenAddPartylist}
        onClose={onCloseAddPartylist}
      />
      <AddPositionModal
        election={currentElection as electionType}
        isOpen={isOpenAddPosition}
        onClose={onCloseAddPosition}
      />
      <AddVoterModal
        election={currentElection as electionType}
        isOpen={isOpenAddVoter}
        onClose={onCloseAddVoter}
      />
      <UploadBulkVotersModal
        isOpen={isOpenUploadBulkVoter}
        onClose={onCloseUploadBulkVoter}
        election={currentElection as electionType}
      />
      <Container maxW="6xl" paddingY="8">
        <Stack spacing={4}>
          <Stack
            justifyContent="space-between"
            direction={["column", "row"]}
            alignItems="center"
          >
            <Stack
              direction={["column", "row"]}
              alignItems="center"
              spacing={[0, 4]}
              width="full"
            >
              <Center
                columnGap={2}
                width={["full", "full", "356px"]}
                justifyContent="space-between"
                flex={5}
                maxWidth={["auto", "sm"]}
              >
                <Select
                  placeholder={
                    false
                      ? !elections?.length
                        ? "Loading..."
                        : "Create election"
                      : undefined
                  }
                  disabled={!elections?.length}
                  value={router.query.electionIdName}
                  onChange={(e) => {
                    router.push(
                      "/" +
                        e.target.value +
                        router.pathname.split("/[electionIdName]")[1]
                    );
                  }}
                >
                  {elections?.map((election) => (
                    <option value={election.electionIdName} key={election.id}>
                      {election.name}
                    </option>
                  ))}
                </Select>
                <Tooltip label="Create an election">
                  <IconButton
                    aria-label="Add election"
                    icon={<PlusIcon width="1.5rem" />}
                    onClick={onOpenCreateElection}
                  />
                </Tooltip>
              </Center>
              <Box display={["none", "none", "initial"]}>
                <Tooltip label="Last updated" hasArrow flex={2}>
                  <Stack
                    direction="row"
                    color={`${
                      (colorMode === "dark" ? "white" : "black") + "Alpha.600"
                    }`}
                    p={2}
                    cursor="pointer"
                    role="group"
                    justifyContent={["center", "flex-start"]}
                  >
                    <Center gap={2}>
                      <Icon
                        as={ArrowPathIcon}
                        _groupHover={{
                          color: `${
                            (colorMode === "dark" ? "white" : "black") +
                            "Alpha.900"
                          }`,
                          transform: "rotate(180deg)",
                          transition: "all 0.5s",
                        }}
                      />
                      {!currentElection ? (
                        <Text fontSize="xs">Loading...</Text>
                      ) : (
                        <Text
                          fontSize="xs"
                          _groupHover={{
                            color: `${
                              (colorMode === "dark" ? "white" : "black") +
                              "Alpha.700"
                            }`,
                            transition: "all 0.5s",
                          }}
                        >
                          Updated{" "}
                          <Moment
                            interval={10000}
                            fromNow
                            date={currentElection.updatedAt.toDate()}
                          />
                        </Text>
                      )}
                    </Center>
                  </Stack>
                </Tooltip>
              </Box>
            </Stack>
            <Link href={`/${currentElection?.electionIdName}`} target="_blank">
              <Button
                isLoading={!currentElection}
                variant="outline"
                rightIcon={<ArrowTopRightOnSquareIcon width={18} />}
                display={["flex", "none", "none", "flex"]}
                width="full"
              >
                {currentElection?.name}
              </Button>
              <IconButton
                aria-label={"Go to" + currentElection?.name}
                icon={<ArrowTopRightOnSquareIcon width={18} />}
                display={["none", "flex", "flex", "none"]}
              />
            </Link>
          </Stack>
          <Flex
            flexDirection={["column", "column", "row"]}
            borderRadius="0.25rem"
            gap={4}
            height="full"
          >
            <Select
              value={router.pathname.split("/dashboard")[1]}
              onChange={(e) => {
                router.push(
                  `/${router.query.electionIdName}/dashboard${e.target.value}`
                );
              }}
              display={["block", "block", "none"]}
            >
              {dashboardSidebar.map((sidebar) => (
                <option value={sidebar.href} key={sidebar.id}>
                  {sidebar.title}
                </option>
              ))}
            </Select>

            <Box
              padding={4}
              backgroundColor={colorMode === "dark" ? "gray.700" : "gray.50"}
              borderRadius="md"
              height="fit-content"
              display={["none", "none", "block"]}
            >
              <DashboardSidebar />
            </Box>

            <Stack
              padding={4}
              backgroundColor={colorMode === "dark" ? "gray.700" : "gray.50"}
              flex="1"
              borderRadius="md"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize={["xl", "2xl"]} fontWeight="bold">
                  {title}
                </Text>
                {(() => {
                  switch (title) {
                    case "Partylists":
                      return (
                        <HStack>
                          <IconButton
                            aria-label="Add partylist"
                            icon={<UserPlusIcon width={18} />}
                            onClick={onOpenAddPartylist}
                            isLoading={!currentElection}
                            display={["inherit", "none"]}
                          />

                          <Button
                            onClick={onOpenAddPartylist}
                            leftIcon={<UserPlusIcon width={18} />}
                            isLoading={!currentElection}
                            display={["none", "inherit"]}
                          >
                            Add partylist
                          </Button>
                        </HStack>
                      );
                    case "Positions":
                      return (
                        <HStack>
                          <IconButton
                            aria-label="Add position"
                            icon={<UserPlusIcon width={18} />}
                            onClick={onOpenAddPosition}
                            isLoading={!currentElection}
                            display={["inherit", "none"]}
                          />

                          <Button
                            onClick={onOpenAddPosition}
                            leftIcon={<UserPlusIcon width={18} />}
                            isLoading={!currentElection}
                            display={["none", "inherit"]}
                          >
                            Add position
                          </Button>
                        </HStack>
                      );
                    case "Voters":
                      return (
                        <HStack>
                          <Tooltip label="Upload bulk voters. (.xlsx)">
                            <IconButton
                              aria-label="Upload bulk voters"
                              icon={<ArrowUpOnSquareIcon width={24} />}
                              onClick={onOpenUploadBulkVoter}
                            />
                          </Tooltip>

                          <IconButton
                            aria-label="Add voter"
                            icon={<UserPlusIcon width={18} />}
                            onClick={onOpenAddVoter}
                            display={["inherit", "none"]}
                          />

                          <Button
                            onClick={onOpenAddVoter}
                            leftIcon={<UserPlusIcon width={18} />}
                            isLoading={!currentElection}
                            display={["none", "inherit"]}
                          >
                            Add voter
                          </Button>
                        </HStack>
                      );
                  }
                })()}
              </Flex>

              <Divider />
              <Box paddingTop={2} overflow={overflow} height="2xl">
                {children}
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </>
  );
};

export default DashboardLayout;
