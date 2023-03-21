import {useContract} from './useContract'
import {useCallback, useMemo} from 'react'
import {BigNumber, BigNumberish, constants} from 'ethers'
import useERC20Allowance from './useERC20Allowance'
import {ABI} from '@/utils/abis'
import {ERC20} from '@/utils/abis/ERC20'
import {useDialog} from '@/components/dialog'
import useErc20Info from "@/hooks/contract/useERC20Info";
import {parseUnits} from "ethers/lib/utils";
import {MaxUint256} from "@ethersproject/constants";

const halfMaxUint256 = MaxUint256.div(2)
// 币的地址  合约的地址
export default function useERC20Approved(address: string, spender: string, amount: BigNumberish = halfMaxUint256) {
    const allowance = useERC20Allowance(address, spender)
    const contract = useContract<ERC20>(address, ABI.ERC20)
    const erc20Info = useErc20Info(address)
    const _amount = useMemo(() => typeof amount === 'number' ? parseUnits(amount + '', erc20Info.decimals) : amount, [amount, erc20Info.decimals])
    const approved = useMemo(() => allowance.gte(_amount), [allowance, _amount])
    const {openDialog, close} = useDialog()

    const approve = useCallback(async () => {
        if (contract) {
            try {
                openDialog({title: 'Approve', desc: 'Waiting for signing.'})
                const operation = await contract.approve(spender, constants.MaxUint256)
                openDialog({title: 'Approve', desc: 'Waiting for blockchain confirmation.'})
                await operation.wait()
                close()
                return true
            } catch (e) {
                return false
            }
        }
    }, [contract, spender])
    return {approved, approve}
}
