let {networkConfig} = require('../helper-hardhat-config')

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId
}) => {

  const { deploy, get, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  let linkTokenAddress
  let vrfCoordinatorAddress
  let ethUsdPriceFeedAddress
  let additionalMessage = ""

  if (chainId == 31337) {
    linkToken = await get('LinkToken')
    VRFCoordinatorMock = await get('VRFCoordinatorMock')
    linkTokenAddress = linkToken.address
    vrfCoordinatorAddress = VRFCoordinatorMock.address
    additionalMessage = " --linkaddress " + linkTokenAddress
    const EthUsdAggregator = await deployments.get('EthUsdAggregator')
    ethUsdPriceFeedAddress = EthUsdAggregator.address
  } else {
    linkTokenAddress = networkConfig[chainId]['linkToken']
    vrfCoordinatorAddress = networkConfig[chainId]['vrfCoordinator']
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
  }
  const keyHash = networkConfig[chainId]['keyHash']
  const fee = networkConfig[chainId]['fee']

  const SeedGameNft = await deploy('SeedGameNft', {
    from: deployer,
    args: [vrfCoordinatorAddress, linkTokenAddress, keyHash, ethUsdPriceFeedAddress], 
    log: true
  })

  const SeedBlockToken = await deploy('SeedBlockToken', {
    from: deployer,
    args: [], 
    log: true
  })


  const Tree = await deploy('Tree', {
    from: deployer,
    args: ["https://gateway.pinata.cloud/ipfs/"], 
    log: true
  })

  const Trade = await deploy('Trade', {
    from: deployer,
    args: [Tree.address,SeedBlockToken.address], 
    log: true
  })

  const SeedBlocksSocialNework = await deploy('SeedBlocksSocialNework', {
    from: deployer,
    args: [Tree.address,SeedBlockToken.address], 
    log: true
  })

  console.log("Contract SeedGameNft deployed to: ", SeedGameNft.address);
  console.log("Contract SeedGameNft deployed to: ", SeedBlocksSocialNework.address);
  console.log("Contract Trade deployed to: ", Trade.address);
  console.log("Contract Tree deployed to: ", Tree.address);
  console.log("Contract SeedBlockRToken deployed to: ", SeedBlockRToken.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");


  await hre.run("verify:verify", {
    address: SeedGameNFt.address,
    network: hre.ethers.provider.network,
    constructorArguments:[vrfCoordinatorAddress, linkTokenAddress, keyHash, ethUsdPriceFeedAddress]
  })

  await hre.run("verify:verify", {
    address: Tree.address,
    network: hre.ethers.provider.network,
    constructorArguments:["https://gateway.pinata.cloud/ipfs/"]
  })




  log("Run the following command to fund contract with LINK:\n")
  log("npx hardhat fund-link --contract " + SeedGameNFt.address + " --network " + networkConfig[chainId]['name'] + additionalMessage)
  log("\nTo generate a character run the following:")
  log("npx hardhat generate-character --contract " + SeedGameNFt.address + " --name InsertNameHere " +  " --network " + networkConfig[chainId]['name'])
  log("To get a character's details as metadata run the following:")
  log("npx hardhat create-metadata --contract " + SeedGameNFt.address + " --network " + networkConfig[chainId]['name'])
  log("----------------------------------------------------")
}

module.exports.tags = ['all', 'D&D']
