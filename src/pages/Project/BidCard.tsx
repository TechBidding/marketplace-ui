import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MdMoreHoriz, MdOutlinePlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";

interface BidProps {
    bid: any;
    hoverClr: string;
    borderClr: string;
    expanded: Record<number, boolean>;
    setExpanded: (expanded: Record<number, boolean>) => void;
    handleBidAction: (bidId: string, action: 'accept' | 'reject') => void
}
export const BidCard: React.FC<BidProps> = ({ bid, hoverClr, borderClr, expanded, setExpanded, handleBidAction }) => {

    let showAccept = true;
    let showReject = true;
    let showBidAction = !showAccept && !showReject

    if (bid.status === 'accepted') {
        showAccept = false;
        showReject = false;
    }
    if (bid.status === 'rejected') {
        showReject = false;
    }


    return (
        <div
            key={bid._id}
            className={`flex flex-col rounded-lg border px-5 py-4 transition-all duration-200 hover:shadow-lg ${hoverClr} ${borderClr}`}
        >
            <div className={`flex items-center justify-between w-full gap-5 ${expanded ? "mb-4" : ""}`}>
                <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => setExpanded({ [bid._id]: !expanded[bid._id] })}>
                    <div className="flex items-center gap-3">
                        {bid.status === "accepted" ? (
                            <MdPlaylistAddCheck className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <MdOutlinePlaylistAdd className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium text-lg">{bid.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {bid.status === "pending" && <span className="text-sm text-yellow-600 font-semibold">Pending</span>}
                        {bid.status === "rejected" && <span className="text-sm text-red-600 font-semibold">Rejected</span>}
                        {bid.status === "accepted" && <span className="text-sm text-green-600 font-semibold">Accepted</span>}
                    </div>
                </div>
                <div className={`flex items-center gap-4 ${showBidAction ? 'show' : 'hidden'}`}>
                    <button className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MdMoreHoriz className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Bid Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {showAccept && (
                                    <DropdownMenuItem onClick={() => handleBidAction(bid._id, "accept")} className="text-green-600 cursor-pointer">Accept</DropdownMenuItem>
                                )}
                                {showReject && (
                                    <DropdownMenuItem onClick={() => handleBidAction(bid._id, "reject")} className="text-red-600 cursor-pointer">Reject</DropdownMenuItem>
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </button>
                </div>
            </div>
            {expanded[bid._id] && (
                <div className="mt-4 w-full text-left text-sm ">
                    <p className="mb-1"><span className="font-semibold">Description:</span> {bid.description}</p>
                    <p className="mb-1"><span className="font-semibold">Amount:</span> {bid.proposedBudget}</p>
                    <p className="mb-1"><span className="font-semibold">Created At:</span> {bid.createdAt}</p>
                    {/* <p className="mb-1"><span className="font-semibold">User:</span>
            <a href="/">User</a>
          </p> */}
                </div>
            )}
        </div>
    );
}