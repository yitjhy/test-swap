import usePairInfo from '@/hooks/usePairInfo'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
// import { DialogType, useDialog } from '@/components/dialog'
import { Global } from '@/types/global'

const usePairInfoList = (pairList: string[]) => {
  const [pairInfoList, setPairInfoList] = useState<Global.TPairInfo[]>([])
  const { getPairDetail } = usePairInfo(constants.AddressZero)
  // const { openDialog, close } = useDialog()
  const getPairInfoList = async () => {
    // openDialog({ title: 'Fetch Liquidity List', desc: 'Waiting...', type: DialogType.loading })
    const promiseList = pairList.map((item) => {
      return getPairDetail(item)
    })
    const values = await Promise.all(promiseList)
    setPairInfoList(values as Global.TPairInfo[])
    // close()
  }
  useEffect(() => {
    getPairInfoList().then()
  }, [pairList, getPairDetail])
  return pairInfoList
}
export default usePairInfoList
