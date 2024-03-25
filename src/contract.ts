import { Bytes, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent
} from "../generated/Contract/Contract";
import { Account, Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let transfer = new Transfer(
    event.transaction.hash.toHex()
  )
  transfer.hash = event.transaction.hash
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.amount = event.params.value

  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp

  transfer.save()

  let sender = Account.load(transfer.from)
  let receiver = Account.load(transfer.to)

  if (receiver == null) {
    receiver = new Account(transfer.to)
    receiver.amount = transfer.amount
    receiver.save()
  }
  else {
    receiver.amount = receiver.amount.plus(transfer.amount)
    receiver.save()
  }

  if (sender != null) {
    sender.amount = sender.amount.minus(transfer.amount)
    sender.save()
  }

}