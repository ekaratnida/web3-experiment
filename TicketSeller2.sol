pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface IStdReference {
    /// A structure returned whenever someone requests for standard reference data.
    struct ReferenceData {
        uint256 rate; // base/quote exchange rate, multiplied by 1e18.
        uint256 lastUpdatedBase; // UNIX epoch of the last time when base price gets updated.
        uint256 lastUpdatedQuote; // UNIX epoch of the last time when quote price gets updated.
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory _base, string memory _quote)
        external
        view
        returns (ReferenceData memory);

    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(string[] memory _bases, string[] memory _quotes)
        external
        view
        returns (ReferenceData[] memory);
}

contract TicketSeller {

    IStdReference ref;
    uint256 public price1;
    uint256 public price2;

    uint256 public remainingTickets;
    mapping (address => uint256) private tickets;

    //koven
    //0xDA7a001b254CD22e46d3eAB04d937489c93174C3 
    //rikenby
    //0x71046b955Cdd96bC54aCa5E66fd69cfb5780f3BB
    constructor(uint256 totalTicket, IStdReference _ref) public {
        remainingTickets = totalTicket;
        ref = _ref;
    }

    function ticketCount(address owner) public view returns (uint256)
    {
        return tickets[owner];
    }

    function transfer(address to) public {
        require(tickets[msg.sender]>0,"MUST_HAVE_TICKET");
        tickets[msg.sender] -= 1;
        tickets[to] += 1;
    }

    function buyTicket() public payable {

        uint256 price = getTicketPrice();
        require(msg.value >= price, "NOT_ENOUGH_PAYMENT");
        require(remainingTickets > 0, "NO_MORE_TICKETS");
        remainingTickets -= 1;
        tickets[msg.sender] += 1; 
    }

    function getPrice(string memory base, string memory quote) external view returns (uint256){
        IStdReference.ReferenceData memory data = ref.getReferenceData(base,quote);
        return data.rate;
    }

    function getRemainingTickets() public view returns (uint256)
    {
        return remainingTickets;
    }

    function getTicketPrice() public payable returns (uint256) {
        
        IStdReference.ReferenceData memory data1 = ref.getReferenceData("THB","USD"); //1 THB เท่ากับกี่ USD
        price1 = data1.rate;

        IStdReference.ReferenceData memory data2 = ref.getReferenceData("ETH","USD");
        price2 = data2.rate;

        return 100 * uint256(price1) * 1e18 / uint256(price2);
    }

}
