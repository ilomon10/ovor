import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Navbar, Colors, ButtonGroup, Button, Classes, Card, FormGroup, InputGroup } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Box } from 'components/utility/grid';
import { container } from 'components/utility/constants';
import LinkButton from 'components/linkButton';
import AspectRatio from 'components/aspectratio';

import featureone from '../assets/feature-1.png';
import featuretwo from '../assets/feature-2.png';
import sponsorhasbi from '../assets/sponsor-1.png';
import sponsorcec from '../assets/sponsor-2.png';

const Component = ({ className }) => {
  return (
    <>
      <Helmet>
        <title>OVoRD | Online Value of Realtime Data</title>
        <meta name="description" content="OVoRD IoT platform" />
      </Helmet>
      <div className={className}>
        <Navbar>
          <Box px={3}
            mx="auto"
            position="relative"
            maxWidth={[...container]}>
            <Navbar.Group align="left">
              <Navbar.Heading>
                <FontAwesomeIcon style={{ color: Colors.GRAY1 }} icon={['ovor', 'logo']} size="2x" />
              </Navbar.Heading>
              <Navbar.Heading>OVoRD</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group className={"bp3-align-center"}>
              <ButtonGroup minimal>
                <Button text="Analytics" />
                <Button text="Image Processing" />
                <Button text="Rule Engine" />
              </ButtonGroup>
            </Navbar.Group>
            <Navbar.Group align="right">
              <LinkButton to="/login" text="Masuk" minimal />
              <Navbar.Divider />
              <Button text="Daftar" outlined />
            </Navbar.Group>
          </Box>
        </Navbar>
        <Box bg={Colors.DARK_GRAY2}>
          <Box mx="auto" py={5}
            maxWidth={[container.sm, container.md, container.lg]}>
            <Flex px={3} mx={-3} alignItems="center" flexDirection={['column', 'row']} >
              <Box px={3} className={Classes.DARK}
                width={[1, 1 / 2, 1 / 9 * 5]} textAlign={['center', 'left']}>
                <h1 className={Classes.HEADING}>Menghemat waktu kerja Anda</h1>
                <Box as="p" fontSize={3} opacity={0.5}>OVoRD adalah platform yang terinspirasi dari cara Anda mengerjakan sistem khususnya IoT. Anda dapat menyimpan, melihat dan menyediakan data untuk membangun sistem IoT tanpa banyak membuang waktu.</Box>
              </Box>
              <Box px={3}
                width={[1, 1 / 2, 1 / 9 * 4]}>
                <Card>
                  <FormGroup label="Nama Lengkap"
                    labelFor="reqister-full_name">
                    <InputGroup large type="text"
                      name="full-name"
                      id="reqister-full_name" />
                  </FormGroup>
                  <FormGroup label="Email"
                    labelFor="reqister-email">
                    <InputGroup large type="email"
                      name="email"
                      id="reqister-email" />
                  </FormGroup>
                  <FormGroup label="Password"
                    labelFor="reqister-password"
                    helperText="Pastikan password yang di daftarkan harus lebih dari 8 karakter termasuk huruf dan angka.">
                    <InputGroup large type="password"
                      name="password"
                      id="reqister-password" />
                  </FormGroup>
                  <FormGroup
                    helperText={`Dengan menekan tombol "Dapatkan Akses", Anda telah menyetujui syarat dan ketentuan yang berlaku. Kami akan mengirimkan email konfirmasi setelah produk ini rilis. `}>
                    <Button fill large intent="success" text="Dapatkan Akses" />
                  </FormGroup>
                </Card>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box mx="auto" py={5}
          maxWidth={[container.sm, container.md, container.lg]}>
          <Flex mb={5} px={3} mx={-3} alignItems="center" flexDirection={['column', 'row']}>
            <Box px={3} width={[1 / 3 * 2, 1 / 2, 1 / 9 * 4]}>
              <AspectRatio ratio="1:1">
                <Box height={"100%"} width={"100%"} bg={Colors.GRAY5}>
                  <img height="100%" width="100%" style={{ objectFit: "cover" }} src={featuretwo} alt={"Rule Engine"} />
                </Box>
              </AspectRatio>
            </Box>
            <Box px={3} width={[1, 1 / 2, 1 / 9 * 5]} textAlign={['center', 'left']}>
              <h2 className={Classes.HEADING}>Platform Untuk Pengembang</h2>
              <Box as="p" mb={3} fontSize={3} opacity={0.5}>Api dan data terbaru langsung kami berikan ke pengembang untuk membangun pengalaman menyimpan dan menvisualisasi yang lebih baik.</Box>
              <h4 className={Classes.HEADING}>
                <a href="/#">Dapatkan API-key Anda sekarang</a>
              </h4>
            </Box>
          </Flex>
          <Flex px={3} mx={-3} alignItems="center" flexDirection={["column", "row-reverse"]}>
            <Box px={3} width={[1 / 3 * 2, 1 / 2, 1 / 9 * 4]}>
              <AspectRatio ratio="1:1">
                <Box height={"100%"} width={"100%"} bg={Colors.GRAY5} overflow="hidden">
                  <img height="100%" width="100%" style={{ objectFit: "cover" }} src={featureone} alt={"Dashboard Builder"} />
                </Box>
              </AspectRatio>
            </Box>
            <Box px={3} width={[1, 1 / 2, 1 / 9 * 5]} textAlign={['center', 'left']}>
              <h2 className={Classes.HEADING}>Data terbaru akan di sediakan secara langsung</h2>
              <Box as="p" mb={3} fontSize={3} opacity={0.5}>Kami menggunakan metode messaging sehingga pengguna dapat mengirim dan menerima data secara real-time.</Box>
              <h4 className={Classes.HEADING}>
                <a href="/#">Pelajari sekarang</a>
              </h4>
            </Box>
          </Flex>
        </Box>
        <Box bg={Colors.LIGHT_GRAY5}>
          <Box mx="auto" py={5} maxWidth={[container.sm, container.md, container.lg]}>
            <Box as="h3" className={Classes.HEADING} textAlign="center" mb={4}>Didukung oleh</Box>
            <Flex mx={[0, -3]} justifyContent="center">
              <Box width={[1 / 2, 1 / 3]} px={3}>
                <AspectRatio ratio="16:9">
                  <Flex as={Card} interactive bg="transparent" height="100%" width="100%" alignItems="center">
                    <Box>
                      <img width="100%" src={sponsorhasbi} alt="Harusnya sih bisa!?" />
                    </Box>
                  </Flex>
                </AspectRatio>
              </Box>
              <Box width={[1 / 2, 1 / 3]} px={3}>
                <AspectRatio ratio="16:9">
                  <Flex as={Card} interactive bg="transparent" height="100%" width="100%" alignItems="center">
                    <Box>
                      <img width="100%" src={sponsorcec} alt="Control Engineering Community" />
                    </Box>
                  </Flex>
                </AspectRatio>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box mx="auto" py={5} maxWidth={[container.sm, container.md, container.lg]}>
          <Flex mb={5} px={3} alignItems="center">
            <Box flexGrow={1}>
              <Box as="h3" className={Classes.HEADING}>Siap memulai?</Box>
              <Box as="p" mb={2} fontSize={3} opacity={0.5}>Buat akun baru atau tanyakan pada ahli.</Box>
            </Box>
            <Box flexShrink={0}>
              <Button outlined text="Tanyakan langsung" />
            </Box>
          </Flex>
          <Box as={Card} py={4}>
            <Box as="h2" textAlign="center" mb={4} className={Classes.HEADING}>Dapatkan akses sebagai tester — gabung sekarang untuk membantu kami mengembangkan platform ini.</Box>
            <Box as={FormGroup} helperText={`Dengan menekan tombol "Dapatkan Akses", Anda telah menyetujui syarat dan ketentuan yang berlaku. Kami akan mengirimkan email konfirmasi setelah produk ini rilis. `}>
              <Flex mx={-2} justifyContent="center" alignItems="center" flexDirection={["column", "row"]}>
                <Box px={2} mb={[2, 0]} width="100%" as={FormGroup} label="Nama Lengkap"
                  labelFor="reqister-full_name">
                  <InputGroup type="text"
                    name="full-name"
                    id="reqister-full_name" />
                </Box>
                <Box px={2} mb={[2, 0]} width="100%" as={FormGroup} label="Email"
                  labelFor="reqister-email">
                  <InputGroup type="email"
                    name="email"
                    id="reqister-email" />
                </Box>
                <Box px={2} mb={[2, 0]} width="100%" as={FormGroup} label="Password"
                  labelFor="reqister-password">
                  <InputGroup type="password"
                    name="password"
                    id="reqister-password" />
                </Box>
                <Box px={2} mb={[1, 0]} width="100%" as={FormGroup}>
                  <Button fill large intent="success" text="Dapatkan Akses" />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
        <Box px={3}>
          <Box mx="auto" py={4} maxWidth={[...container]}>
            <Flex flexWrap="wrap">
              <Box width={[1 / 2, 1 / 3, 1 / 4]}>
                <Box as="h3" className={Classes.HEADING}>OVoRD</Box>
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 4]}>
                <Box as="h3" className={Classes.HEADING}>Product</Box>
                <Box>
                  <Box as="a" href="#" mr={2}>Analytics</Box>
                  <Box as="a" href="#" mr={2}>Image Processing</Box>
                  <Box as="a" href="#" mr={2}>Rule Engine</Box>
                </Box>
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 4]}>
                <Box as="h3" className={Classes.HEADING}>Learn</Box>
                <Box>
                  <Box as="a" href="#" mr={2}>Documentation</Box>
                  <Box as="a" href="#" mr={2}>Guides</Box>
                  <Box as="a" href="#" mr={2}>Blog</Box>
                </Box>
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 4]}>
                <Box as="h3" className={Classes.HEADING}>Follow us</Box>
                <Box>
                  <Box as="a" href="#" mr={2}>Twitter</Box>
                  <Box as="a" href="#" mr={2}>Youtube</Box>
                  <Box as="a" href="#" mr={2}>Linkedin</Box>
                  <Box as="a" href="#" mr={2}>Github</Box>
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box bg={Colors.LIGHT_GRAY5} py={3}>
            <Box as="p" textAlign="center" m={0} opacity={0.5}>© {new Date().getFullYear()} tagConn, All rights reserved. — <a href="https://www.github.com">GitHub</a> design inspired.</Box>
          </Box>
        </Box>
      </div>
    </>
  )
}

const Landing = styled(Component)`
  .${Classes.NAVBAR} {
    padding: 0;
    .${Classes.NAVBAR_GROUP}.bp3-align-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export default Landing;