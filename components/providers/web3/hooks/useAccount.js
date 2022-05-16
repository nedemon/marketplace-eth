
import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0x22d54cb291e96d27699ab1eae74aa915e15fa841fe8877552acb56039b4c3d56": true,
  "0xfd36511c8035a501abab2a9414fc41361ac1e1212193c930db48a118289a2b2f": true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()

      const account = accounts[0]

      if (!account) {
        throw new Error("Cannot retreive an account. Please refresh the browser.")
      }

      return account
    }
  )

  useEffect(() => {

    const mutator = accounts => mutate(accounts[0] ?? null)
    provider?.on("accountsChanged", mutator)
    return () => {
      provider?.removeListener("accountsChanged", mutator)
    }
  }, [provider])

  return {
      data,
      isAdmin: (
        data &&
        adminAddresses[web3.utils.keccak256(data)]) ?? false,
      mutate,
      ...rest
    }
  }