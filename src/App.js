import React, { useState, useCallback, useEffect } from "react";
import Web3 from "web3";

import tokenIcon from "./assets/tokenIcon.png";

import abi from "./abi.json";
import routerAbi from "./routerAbi.json";

import {
  Container,
  LeftContainer,
  LeftContent,
  RightContainer,
  Button,
  Input,
  Typography,
  RightHeader,
  RightContent,
  RightSwap,
  Box,
} from "./styles";

import {
  ArrowDownIcon,
  GraphIcon,
  InstagramIcon,
  SwapIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./assets";

import {
  BNB_ADDRESS,
  PancakeSwapRouterV2,
  contractAddress,
  decimals,
  nodeURL,
  symbol,
} from "./constants";

const web3 = new Web3(nodeURL);
const tokenContract = new web3.eth.Contract(abi, contractAddress);
const contract = new web3.eth.Contract(routerAbi, PancakeSwapRouterV2);

const App = () => {
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [status, setStatus] = useState("disconnected");

  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isBuying, setIsBuying] = useState(true);
  const [hasTokenApproved, setHasTokenApproved] = useState(false);

  const hasTokenApprovedFunc = useCallback(async () => {
    if (account) {
      try {
        let allowance = await tokenContract.methods
          .allowance(account, PancakeSwapRouterV2)
          .call();

        const formattedAllowance = allowance / 10 ** decimals;

        console.log("formattedAllowance: ", formattedAllowance);
        console.log("tokenBalance: ", tokenBalance);

        if (formattedAllowance >= tokenBalance) {
          setHasTokenApproved(true);
        } else {
          setHasTokenApproved(false);
        }
      } catch (err) {
        console.debug("err: ", err);
        setHasTokenApproved(false);
      }
    }
  }, [account, tokenBalance]);

  const swapExactETHForTokensSupportingFeeOnTransferTokens = useCallback(
    (amount, path) => {
      let swapMethod =
        contract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
          "0",
          path,
          account,
          Math.floor(Date.now() / 1000) + 60 // 60 seconds
        );

      let encodedData = swapMethod.encodeABI();

      amount = web3.utils.toHex(web3.utils.toWei(amount.toString()));

      const tx = {
        from: account,
        to: PancakeSwapRouterV2,
        gas: web3.utils.toHex("1000000"),
        data: encodedData,
        value: amount,
      };

      return tx;
    },
    [account]
  );

  const swapExactTokensForETHSupportingFeeOnTransferTokens = useCallback(
    (amount, path) => {
      let swapMethod =
        contract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
          amount,
          "0",
          path,
          account,
          Math.floor(Date.now() / 1000) + 60 // 60 seconds
        );

      let encodedData = swapMethod.encodeABI();

      const tx = {
        from: account,
        to: PancakeSwapRouterV2,
        gas: web3.utils.toHex("1000000"),
        data: encodedData,
      };

      return tx;
    },
    [account]
  );

  const switchChain = useCallback(() => {
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            nativeCurrency: {
              name: "BNB",
              symbol: "bnb",
              decimals: 18,
            },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com/"],
          },
        ],
      })
      .then((res) => {
        console.debug("res: ", res);
      })
      .catch((err) => {
        console.debug("err: ", err);
      });
  }, []);

  const buy = useCallback(async () => {
    if (chainId !== "0x38") {
      switchChain();
      return;
    }

    let tx = swapExactETHForTokensSupportingFeeOnTransferTokens(fromAmount, [
      BNB_ADDRESS,
      contractAddress,
    ]);

    if (window.ethereum)
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [tx],
        })
        .then((res) => {
          console.debug("buy tx: ", res);
        })
        .catch((err) => {
          console.debug("err: ", err);
        });
  }, [
    chainId,
    fromAmount,
    swapExactETHForTokensSupportingFeeOnTransferTokens,
    switchChain,
  ]);

  const sell = useCallback(async () => {
    if (chainId !== "0x38") {
      switchChain();
      return;
    }

    console.log("fromAmount:", fromAmount);
    console.log(
      "fromAmount2:",
      `${Number(fromAmount).toFixed(0)}${Array.from({ length: decimals })
        .map(() => "0")
        .join("")}`
    );

    let tx = swapExactTokensForETHSupportingFeeOnTransferTokens(
      `${Number(fromAmount).toFixed(0)}${Array.from({ length: decimals })
        .map(() => "0")
        .join("")}`,
      [contractAddress, BNB_ADDRESS]
    );

    console.log("tx: ", tx);

    if (window.ethereum)
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [tx],
        })
        .then((res) => {
          console.debug("sell tx: ", res);
        })
        .catch((err) => {
          console.debug("err: ", err);
        });
  }, [
    chainId,
    fromAmount,
    swapExactTokensForETHSupportingFeeOnTransferTokens,
    switchChain,
  ]);

  const approve = useCallback(async () => {
    if (chainId !== "0x38") {
      switchChain();
      return;
    }

    let approveMethod = tokenContract.methods.approve(
      PancakeSwapRouterV2,
      web3.utils.toWei(
        "10000000000000000000000000000000000000000000000000000000000"
      )
    );

    let encodedData = approveMethod.encodeABI();

    const tx = {
      from: account,
      to: contractAddress,
      gas: web3.utils.toHex("1000000"),
      data: encodedData,
    };

    if (window.ethereum)
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [tx],
        })
        .then((res) => {
          console.debug("approve tx: ", res);
          setHasTokenApproved(true);
        })
        .catch((err) => {
          console.debug("err: ", err);
        });
  }, [account, chainId, switchChain]);

  const handleConnect = useCallback(() => {
    window.ethereum.enable();
  }, []);

  const handleAddToken = useCallback(() => {
    console.log("chainId: ", chainId);

    if (chainId !== "0x38") {
      switchChain();
      return;
    }

    if (window.ethereum)
      window.ethereum
        .request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: contractAddress,
              symbol,
              decimals,
            },
          },
        })
        .then((res) => {
          console.debug("add token tx: ", res);
        })
        .catch((err) => {
          console.debug("err: ", err);
        });
  }, [chainId, switchChain]);

  const handleAccountsChanged = useCallback((accounts) => {
    console.debug("accounts: ", accounts);

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setStatus("connected");
    }

    if (accounts.length === 0) {
      setAccount();
    }
  }, []);

  const handleChainChanged = useCallback((chainId) => {
    console.debug("chainId: ", chainId);

    setChainId(chainId);
  }, []);

  const handleProviderConnect = useCallback((connectInfo) => {
    console.debug("connectInfo: ", connectInfo);

    setStatus("connected");
    setChainId(connectInfo.chainId);
  }, []);

  const handleDisconnect = useCallback((error) => {
    console.debug("error: ", error);

    setStatus("disconnected");
    setAccount();
  }, []);

  useEffect(() => {
    handleConnect();
  }, [handleConnect]);

  useEffect(() => {
    if (!fromAmount) {
      setToAmount(0);
    }

    if (fromAmount && status === "connected") {
      if (isBuying) {
        const bnbAmountIn = web3.utils.toWei(fromAmount.toString(), "ether");

        contract.methods
          .getAmountsOut(bnbAmountIn, [BNB_ADDRESS, contractAddress])
          .call()
          .then((res) => {
            setToAmount(res[1] / 10 ** decimals);
          })
          .catch((err) => {
            setToAmount(0);
          });
      } else {
        const tokenAmountIn = web3.utils.toWei(fromAmount.toString(), "ether");

        contract.methods
          .getAmountsOut(tokenAmountIn, [contractAddress, BNB_ADDRESS])
          .call()
          .then((res) => {
            setToAmount(res[1] / 10 ** 18);
          })
          .catch((err) => {
            setToAmount(0);
          });
      }
    }
  }, [fromAmount, isBuying, status]);

  useEffect(() => {
    let interval;

    if (window.ethereum && account) {
      interval = setInterval(() => {
        tokenContract?.methods
          .balanceOf(account)
          .call()
          .then((res) => {
            console.debug("token balance: ", res);

            setTokenBalance(res / 10 ** decimals);
          })
          .catch((err) => {
            console.debug("err: ", err);
          });

        web3.eth
          .getBalance(account)
          .then((res) => {
            console.debug("bnb balance: ", res);

            setBnbBalance(web3.utils.fromWei(res, "ether"));
          })
          .catch((err) => {
            console.debug("err: ", err);
          });
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [account]);

  useEffect(() => {
    if (status === "connected") hasTokenApprovedFunc();
  }, [hasTokenApprovedFunc, tokenBalance, status]);

  useEffect(() => {
    window.ethereum
      .send("eth_requestAccounts", [])
      .then((res) => {
        console.debug("res: ", res);

        if (res.result?.length > 0) {
          setAccount(res?.result[0]);
        }
      })
      .catch((err) => {
        console.debug("err: ", err);
      });

    window.ethereum
      .request({ method: "eth_chainId" })
      .then((res) => {
        console.debug("chainId: ", res);

        setChainId(res);
      })
      .catch((err) => {
        console.debug("err: ", err);
      });

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("connect", handleProviderConnect);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("connect", handleProviderConnect);
      window.ethereum.removeListener("disconnect", handleDisconnect);
    };
  }, [
    handleAccountsChanged,
    handleChainChanged,
    handleDisconnect,
    handleProviderConnect,
  ]);

  return (
    <Container>
      <LeftContainer>
        <LeftContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <img src={tokenIcon} alt={symbol} width={55} height={55} />
            <Typography color="#5eb3e5" size="18px">
              {symbol}
            </Typography>
          </div>
          <Button fluid active pointer>
            <SwapIcon
              color="#5eb3e5"
              style={{
                marginRight: "1rem",
              }}
            />
            <Typography size="18px">Swap</Typography>
          </Button>

          <div
            style={{
              position: "absolute",
              bottom: "24px",
              display: "flex",
              width: "calc(100% - 48px)",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              color: "#5eb3e5",
            }}
          >
            <TwitterIcon color="#5eb3e5" cursor="pointer" />
            <InstagramIcon color="#5eb3e5" cursor="pointer" />
            <YoutubeIcon color="#5eb3e5" cursor="pointer" />
            <TelegramIcon color="#5eb3e5" cursor="pointer" />
          </div>
        </LeftContent>
      </LeftContainer>
      <RightContainer>
        <RightHeader>
          <Button
            pointer
            color="#2b2b27"
            border="1px solid #5eb3e5"
            radius="14px"
            onClick={handleAddToken}
          >
            <Typography pointer>Add {symbol}</Typography>
          </Button>
          <Button
            pointer
            color="#2b2b27"
            border="1px solid #5eb3e5"
            radius="14px"
            onClick={handleConnect}
          >
            <Typography pointer>{account ?? "Connect wallet"}</Typography>
          </Button>
        </RightHeader>
        <RightContent>
          <RightSwap>
            <Typography
              size="20px"
              color="#fff"
              weight="bold"
              style={{
                width: "100%",
                marginBottom: "8px",
              }}
            >
              Trade tokens fastly!
            </Typography>

            <Box
              align="flex-start"
              color="#2b2b27"
              direction="column"
              padding="16px"
              height="112px"
              radius="24px"
              border="1px solid #5eb3e5"
              margin="28px 0 16px 0"
            >
              <Box
                align="flex-start"
                direction="row"
                width="100%"
                height="36px"
                justify="space-between"
              >
                <Typography size="16px" color="#5eb3e5">
                  From:
                </Typography>
                <Typography size="16px" color="rgba(255, 255, 255, 0.44)">
                  Balance:{" "}
                  {account
                    ? Number(isBuying ? bnbBalance : tokenBalance)?.toFixed(6)
                    : "0.000000000"}{" "}
                  {isBuying ? "BNB" : symbol}
                </Typography>
              </Box>
              <Box
                align="flex-start"
                direction="row"
                width="100%"
                height="64px"
                justify="space-between"
              >
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.0"
                  width="65%"
                  align="center"
                  value={fromAmount}
                  onChange={(e) => {
                    setFromAmount(e.target.value);
                  }}
                />
                <Box
                  direction="row"
                  width="35%"
                  align="center"
                  justify="flex-end"
                  gap="12px"
                >
                  <Typography
                    pointer
                    weight="bold"
                    size="16px"
                    color="#5eb3e5"
                    onClick={() => {
                      if (account) {
                        setFromAmount(
                          Number(isBuying ? bnbBalance : tokenBalance)?.toFixed(
                            6
                          )
                        );
                      }
                    }}
                  >
                    Max:
                  </Typography>

                  <Box
                    align="center"
                    direction="row"
                    width="110px"
                    height="56px"
                    justify="center"
                    color="#419edf7F"
                    border="1px solid #5eb3e5"
                    radius="9999px"
                    style={{
                      gap: isBuying ? "12px" : "2px",
                    }}
                  >
                    {isBuying ? (
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/1/1c/BNB%2C_native_cryptocurrency_for_the_Binance_Smart_Chain.svg"
                          alt="BNB"
                          width={28}
                          height={28}
                        />
                        <Typography weight="bold" size="16px" color="#FFF">
                          BNB
                        </Typography>
                      </>
                    ) : (
                      <>
                        <img
                          src={tokenIcon}
                          alt={symbol}
                          width={28}
                          height={28}
                        />
                        <Typography weight="bold" size="16px" color="#FFF">
                          {symbol}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            <ArrowDownIcon
              color="#5eb3e5"
              onClick={() => setIsBuying((prev) => !prev)}
              style={{
                cursor: "pointer",
              }}
            />

            <Box
              align="flex-start"
              color="#2b2b27"
              direction="column"
              padding="16px"
              height="112px"
              radius="24px"
              border="1px solid #5eb3e5"
              margin="28px 0 16px 0"
              opacity="0.5"
            >
              <Box
                align="flex-start"
                direction="row"
                width="100%"
                height="36px"
                justify="space-between"
              >
                <Typography size="16px" color="#5eb3e5">
                  To:
                </Typography>
                <Typography size="16px" color="rgba(255, 255, 255, 0.44)">
                  Balance:{" "}
                  {account
                    ? Number(isBuying ? tokenBalance : bnbBalance)?.toFixed(6)
                    : "0.000000000"}{" "}
                  {isBuying ? symbol : "BNB"}
                </Typography>
              </Box>
              <Box
                align="flex-start"
                direction="row"
                width="100%"
                height="64px"
                justify="space-between"
              >
                <Input
                  type="number"
                  step="0.01"
                  width="65%"
                  align="center"
                  min={0}
                  placeholder="0.0"
                  value={toAmount}
                  disabled
                />
                <Box
                  direction="row"
                  width="35%"
                  align="center"
                  justify="flex-end"
                  gap="12px"
                >
                  <Typography weight="bold" size="16px" color="#5eb3e5">
                    Max:
                  </Typography>

                  <Box
                    align="center"
                    direction="row"
                    width="110px"
                    height="56px"
                    justify="center"
                    color="#419edf7F"
                    border="1px solid #5eb3e5"
                    radius="9999px"
                    style={{
                      gap: isBuying ? "2px" : "12px",
                    }}
                  >
                    {isBuying ? (
                      <>
                        <img
                          src={tokenIcon}
                          alt={symbol}
                          width={28}
                          height={28}
                        />
                        <Typography weight="bold" size="16px" color="#FFF">
                          {symbol}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/1/1c/BNB%2C_native_cryptocurrency_for_the_Binance_Smart_Chain.svg"
                          alt="BNB"
                          width={28}
                          height={28}
                        />
                        <Typography weight="bold" size="16px" color="#FFF">
                          BNB
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Button
              align
              pointer
              fluid
              color={fromAmount === 0 ? "#000" : "#1bc870"}
              radius="9999px"
              height="56px"
              style={{
                width: "100%",
              }}
              onClick={() => {
                if (isBuying) {
                  buy();
                } else {
                  if (hasTokenApproved) {
                    sell();
                  } else {
                    approve();
                  }
                }
              }}
              disabled={toAmount === 0 || !fromAmount}
            >
              <Typography size="18px">
                {toAmount === 0 || !fromAmount
                  ? "Input a value first!"
                  : isBuying
                  ? "Buy"
                  : hasTokenApproved
                  ? "Sell"
                  : `Approve ${symbol}`}
              </Typography>
            </Button>

            <Box
              align="flex-start"
              direction="row"
              width="100%"
              height="40px"
              justify="space-between"
              margin="16px 0 0 0"
            >
              <Box
                align="center"
                direction="row"
                width="160px"
                height="40px"
                justify="space-evenly"
                border="1px solid #5eb3e5"
                color="#2b2b27"
                radius="12px"
              >
                <Typography weight="bold" size="16px" color="#FFF">
                  BNB:
                </Typography>

                <GraphIcon
                  cursor="pointer"
                  width={24}
                  height={24}
                  color="#1bc870"
                  onClick={() => {
                    window.open(
                      `https://poocoin.app/tokens/${BNB_ADDRESS}`,
                      "_blank"
                    );
                  }}
                />
              </Box>

              <Box
                align="center"
                direction="row"
                width="160px"
                height="40px"
                justify="space-evenly"
                border="1px solid #5eb3e5"
                color="#2b2b27"
                radius="12px"
              >
                <Typography weight="bold" size="16px" color="#FFF">
                  {symbol}:
                </Typography>

                <GraphIcon
                  cursor="pointer"
                  width={24}
                  height={24}
                  color="#1bc870"
                  onClick={() => {
                    window.open(
                      `https://poocoin.app/tokens/${contractAddress}`,
                      "_blank"
                    );
                  }}
                />

                {/* <img
                  width={24}
                  height={24}
                  src="https://app.bogged.finance/img/metamask-fox.c06f3a3e.svg"
                  alt={`Add ${symbol} to Metamask`}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleAddToken}
                /> */}
              </Box>
            </Box>
          </RightSwap>
        </RightContent>
      </RightContainer>
    </Container>
  );
};

export default App;
