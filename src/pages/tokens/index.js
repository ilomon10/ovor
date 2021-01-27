import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Colors, H2, HTMLTable, Dialog } from '@blueprintjs/core';
import moment from 'moment';

import Container from 'components/container';
import Wrapper from 'components/wrapper';
import InputCopy from 'components/inputCopy';
import { FeathersContext } from 'components/feathers';
import { useMedia } from "components/helper";
import { container } from 'components/utility/constants';
import { Flex, Box } from 'components/utility/grid';

import GenerateNewToken from './generateNewToken';
import DeleteToken from './deleteToken';

const Tokens = () => {
  const feathers = useContext(FeathersContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(undefined);

  const columnCount = useMedia(
    container.map((v) => `(min-width: ${v})`).reverse(),
    [5, 4, 3, 2], 1
  )

  const [tokens, setTokens] = useState({
    data: [],
    total: 0
  });
  const removeToken = useCallback((token) => {
    setSelectedToken(token);
  }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetch = async () => {
      const tokens = await feathers.tokens.find({
        query: {
          $select: ["_id", "updatedAt", "key", "name"],
          $sort: { updatedAt: -1 }
        }
      });
      setTokens(() => ({
        data: tokens.data,
        total: tokens.total
      }))
    }
    fetch();
    const onTokenCreated = ({ _id, name, key, updatedAt }) => {
      setTokens((token) => ({
        data: [
          { _id, name, key, updatedAt },
          ...token.data
        ],
        total: token.total + 1
      }))
    }
    const onTokenRemoved = (res) => {
      setTokens((token) => ({
        data: token.data.filter(t => t._id !== res._id),
        total: token.total - 1
      }))
    }
    feathers.tokens.on('created', onTokenCreated)
    feathers.tokens.on('removed', onTokenRemoved);
    return () => {
      feathers.tokens.removeListener('created', onTokenCreated);
      feathers.tokens.removeListener('removed', onTokenRemoved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Token | Ovor</title>
        <meta name="description" content="Access token manager" />
      </Helmet>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%', position: "relative" }}>
        <Wrapper style={{ overflowY: 'auto' }}>
          <Container style={{ paddingTop: 16 }}>
            <Flex>
              <Box flexGrow={1}>
                <H2>Access Token</H2>
              </Box>
              <Box flexShrink={0}>
                <Button icon="plus"
                  text={columnCount < 2 ? "Token" : "Generate new token"}
                  onClick={() => {
                    setIsDialogOpen(true);
                  }} />
              </Box>
            </Flex>
            <p>You need API access token to configure on device.</p>
            <HTMLTable style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Token</th>
                  <th>Last modified</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tokens.data.map(v => (
                  <tr key={v._id}>
                    <td style={{ verticalAlign: "middle" }}>{v.name}</td>
                    <td><InputCopy fill small defaultValue={v.key} /></td>
                    <td style={{ verticalAlign: "middle" }}>{moment(v.updatedAt).calendar()}</td>
                    <td>
                      <Button minimal small
                        intent="danger"
                        icon="trash"
                        onClick={() => removeToken(v)} />
                    </td>
                  </tr>))}
              </tbody>
            </HTMLTable>
            <Dialog
              title="Generate new token"
              canOutsideClickClose={false}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}>
              <GenerateNewToken onClose={() => setIsDialogOpen(false)} />
            </Dialog>
            <Dialog
              title="Delete token"
              isOpen={typeof selectedToken !== 'undefined'}
              onClose={() => setSelectedToken(undefined)}>
              <DeleteToken data={selectedToken} onClose={() => setSelectedToken(undefined)} />
            </Dialog>
          </Container>
        </Wrapper>
      </div>
    </>
  )
}

export default Tokens;