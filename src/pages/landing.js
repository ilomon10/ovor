import React from 'react';
import styled from 'styled-components';
import { Navbar, Colors, ButtonGroup, Button, Classes, Card, FormGroup, InputGroup } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Box } from 'components/utility/grid';
import utilConst from 'components/utility/constants';

const Component = ({ className }) => {
  console.log(utilConst.container.slice(0, utilConst.container.length - 1));
  return (
    <div className={className}>
      <Navbar>
        <Box px={3}
          mx="auto"
          position="relative"
          width={utilConst.container}>
          <Navbar.Group align="left">
            <Navbar.Heading>
              <FontAwesomeIcon style={{ color: Colors.GRAY1 }} icon={['ovor', 'logo']} size="2x" />
            </Navbar.Heading>
            <Navbar.Heading>OVORD</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group className={"bp3-align-center"}>
            <ButtonGroup minimal>
              <Button text="Analytics" />
              <Button text="Image Processing" />
              <Button text="Rule Engine" />
            </ButtonGroup>
          </Navbar.Group>
          <Navbar.Group align="right">
            <Button text="Masuk" minimal />
            <Navbar.Divider />
            <Button text="Daftar" outlined />
          </Navbar.Group>
        </Box>
      </Navbar>
      <Box bg={Colors.DARK_GRAY2}>
        <Box mx="auto" py={5}
          width={utilConst.container.slice(0, utilConst.container.length - 1)}>
          <Flex px={3} mx={-3} alignItems="center">
            <Box px={3} className={Classes.DARK}
              width={[1 / 5 * 3]}>
              <h1 className={Classes.HEADING}>Menghemat waktu kerja Anda</h1>
              <Box as="p" fontSize={3} opacity={0.5}>Ovor adalah platform yang terinspirasi dari cara Anda bekerja. Anda dapat menyimpan, melihat dan menyediakan data untuk membangun sistem IoT tanpa banyak membuang waktu.</Box>
            </Box>
            <Box px={3}
              width={[1 / 5 * 2]}>
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
                <FormGroup label="Verifikasi Password"
                  labelFor="reqister-confirm_password">
                  <InputGroup large type="password"
                    name="confirm-password"
                    id="reqister-confirm_password" />
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
    </div>
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