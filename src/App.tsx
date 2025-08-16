import React, { useState } from 'react';
import { Shield, Users, Wallet, CheckCircle, AlertTriangle, MessageSquare, Star, Clock, TrendingUp, Lock, Eye, FileText, Plus, Send, Camera, CreditCard, Phone, Mail, MapPin, User, X, Search } from 'lucide-react';

// แยกคอมโพเนนต์ TransactionDetailModal ออกมาข้างนอก
const TransactionDetailModal = ({ 
  selectedTransaction, 
  setSelectedTransaction,
  chatInput,
  setChatInput,
  handleSendMessage,
  setShowDisputeModal
}) => {
  if (!selectedTransaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">รายละเอียดธุรกรรม</h2>
          <button 
            onClick={() => setSelectedTransaction(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">รหัสธุรกรรม</p>
                <p className="font-medium">{selectedTransaction.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Escrow ID</p>
                <p className="font-medium">{selectedTransaction.escrowId}</p>
              </div>
              <div>
                <p className="text-gray-600">สถานะ</p>
                <p className="font-medium text-green-600">
                  {selectedTransaction.status === 'completed' ? 'สำเร็จ' : 'กำลังดำเนินการ'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">วันที่สร้าง</p>
                <p className="font-medium">{selectedTransaction.created}</p>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div>
            <h3 className="font-semibold mb-2">รายละเอียดสินค้า</h3>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium text-lg mb-1">{selectedTransaction.item}</h4>
              <p className="text-gray-600 mb-3">{selectedTransaction.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ฿{selectedTransaction.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    + ค่าธรรมเนียม ฿{selectedTransaction.fee}
                  </span>
                </div>
                {selectedTransaction.trackingNumber && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">หมายเลขติดตาม</p>
                    <p className="font-medium text-blue-600">{selectedTransaction.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div>
            <h3 className="font-semibold mb-3">ความคืบหน้า</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">สร้างธุรกรรม</p>
                  <p className="text-sm text-gray-500">{selectedTransaction.created}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTransaction.status !== 'waiting_payment' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Wallet size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">ชำระเงินเข้า Escrow</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.status !== 'waiting_payment' ? 'เงินเข้าระบบแล้ว' : 'รอการชำระเงิน'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTransaction.sellerConfirmed ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <Send size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">ผู้ขายยืนยันการส่ง</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.sellerConfirmed ? 'ยืนยันแล้ว' : 'รอการยืนยัน'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTransaction.buyerConfirmed ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">ผู้ซื้อยืนยันการรับ</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.buyerConfirmed ? 'ยืนยันแล้ว' : 'รอการยืนยัน'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTransaction.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <CreditCard size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">ปล่อยเงินให้ผู้ขาย</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.status === 'completed' ? `เสร็จสิ้น ${selectedTransaction.completed}` : 'รอการยืนยัน'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div>
            <h3 className="font-semibold mb-3">การสนทนา</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {selectedTransaction.chatMessages && selectedTransaction.chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-lg px-3 py-2 ${
                      msg.sender === 'buyer' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-800 border'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'buyer' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
              <input 
                type="text" 
                placeholder="พิมพ์ข้อความ..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <button 
              onClick={() => setSelectedTransaction(null)}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
            {selectedTransaction.status !== 'completed' && (
              <button 
                onClick={() => setShowDisputeModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                รายงานปัญหา
              </button>
            )}
            {selectedTransaction.status === 'completed' && !selectedTransaction.rating && (
              <button 
                onClick={() => {setSelectedTransaction(selectedTransaction); setShowRatingModal(true);}}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                ให้คะแนน
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ... โค้ดส่วนอื่น ๆ ที่เหลือเหมือนเดิม ...

const SecureEscrowApp = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showJoinTransactionModal, setShowJoinTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [chatInput, setChatInput] = useState(''); // ใช้ state นี้สำหรับ input chat
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [joinTransactionId, setJoinTransactionId] = useState('');

  const [user, setUser] = useState({
    id: 'USR001',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    verified: true,
    rating: 4.8,
    totalTransactions: 47,
    balance: 15420,
    joinDate: '2024-01-15'
  });

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      type: 'buyer',
      item: 'iPhone 14 Pro Max 256GB สีม่วง',
      description: 'มือสอง ใช้งาน 6 เดือน สภาพดีมาก มีกล่อง',
      amount: 42000,
      fee: 630, // 1.5%
      status: 'waiting_confirmation',
      otherParty: 'ร้านมือถือโปร',
      otherPartyId: 'USR045',
      otherPartyRating: 4.9,
      created: '2025-08-15',
      buyerConfirmed: false,
      sellerConfirmed: true,
      trackingNumber: 'EMS1234567890',
      escrowId: 'ESC001',
      chatMessages: [
        { sender: 'seller', message: 'สวัสดีครับ', time: '10:29' },
        { sender: 'buyer', message: 'สวัสดีครับ ตอนนี้สินค้าส่งแล้วหรือยังครับ', time: '10:30' },
        { sender: 'seller', message: 'ส่งแล้วครับ tracking: EMS1234567890', time: '10:45' },
        { sender: 'buyer', message: 'ขอบคุณครับ', time: '10:46' }
      ]
    },
    {
      id: 'TXN002',
      type: 'seller',
      item: 'MacBook Air M2 13" 256GB',
      description: 'ใหม่ในกล่อง ยังไม่แกะ รับประกันศูนย์ไทย',
      amount: 35000,
      fee: 525,
      status: 'completed',
      otherParty: 'คุณสมหญิง รักการเรียน',
      otherPartyId: 'USR078',
      otherPartyRating: 4.7,
      created: '2025-08-10',
      completed: '2025-08-13',
      buyerConfirmed: true,
      sellerConfirmed: true,
      escrowId: 'ESC002',
      rating: 5,
      chatMessages: []
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'buyer',
    item: '',
    description: '',
    amount: '',
    otherPartyContact: '',
    category: 'electronics'
  });

  const [kycData, setKycData] = useState({
    idCardNumber: '',
    fullName: '',
    address: '',
    bankAccount: '',
    bankName: 'กรุงเทพ'
  });

  const handleCreateTransaction = () => {
    if (!newTransaction.item || !newTransaction.amount || !newTransaction.otherPartyContact) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const fee = Math.round(parseFloat(newTransaction.amount) * 0.015); // 1.5% fee
    const transactionId = `TXN${String(transactions.length + 1).padStart(3, '0')}`;
    
    const transaction = {
      id: transactionId,
      type: newTransaction.type,
      item: newTransaction.item,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      fee: fee,
      status: 'waiting_payment',
      otherParty: newTransaction.otherPartyContact,
      otherPartyId: `USR${Math.floor(Math.random() * 900) + 100}`,
      otherPartyRating: (Math.random() * 1 + 4).toFixed(1),
      created: new Date().toISOString().split('T')[0],
      buyerConfirmed: false,
      sellerConfirmed: false,
      escrowId: `ESC${String(transactions.length + 1).padStart(3, '0')}`,
      chatMessages: []
    };

    setTransactions([transaction, ...transactions]);
    setSelectedTransaction(transaction);
    setShowCreateTransaction(false);
    setShowPaymentModal(true);
    setNewTransaction({ type: 'buyer', item: '', description: '', amount: '', otherPartyContact: '', category: 'electronics' });
  };
  
  const handleJoinTransaction = () => {
    if (!joinTransactionId) {
      alert('กรุณากรอกรหัสธุรกรรม');
      return;
    }

    const foundTransaction = transactions.find(t => t.id.toLowerCase() === joinTransactionId.toLowerCase());

    if (foundTransaction) {
      if (foundTransaction.status === 'waiting_payment') {
        setSelectedTransaction(foundTransaction);
        setShowJoinTransactionModal(false);
        setShowPaymentModal(true);
      } else {
        alert('ธุรกรรมนี้ไม่อยู่ในสถานะที่สามารถชำระเงินได้');
      }
    } else {
      alert('ไม่พบรหัสธุรกรรมนี้');
    }
  };

  const handlePaymentConfirmation = () => {
    if (!selectedTransaction) return;

    setTransactions(prev => 
      prev.map(txn => 
        txn.id === selectedTransaction.id 
          ? { ...txn, status: 'waiting_confirmation' }
          : txn
      )
    );

    setShowPaymentModal(false);
    setSelectedTransaction(prev => ({ ...prev, status: 'waiting_confirmation' }));
    alert('แจ้งชำระเงินเรียบร้อยแล้ว! ธุรกรรมจะถูกปรับสถานะเมื่อผู้ขายตรวจสอบการชำระเงิน');
  };

  const handleWalletPayment = () => {
    const pendingTxn = transactions.find(t => t.type === 'buyer' && t.status === 'waiting_payment');
    
    if (pendingTxn) {
      const totalAmount = pendingTxn.amount + pendingTxn.fee;
      if (user.balance >= totalAmount) {
        // Simulate payment
        setTransactions(prev => prev.map(txn => 
          txn.id === pendingTxn.id ? { ...txn, status: 'waiting_confirmation' } : txn
        ));
        setUser(prev => ({
          ...prev,
          balance: prev.balance - totalAmount
        }));
        alert(`ชำระเงิน ฿${totalAmount.toLocaleString()} จากกระเป๋ากลางสำเร็จ! ธุรกรรม ${pendingTxn.id} กำลังดำเนินการ`);
      } else {
        alert('ยอดเงินในกระเป๋ากลางไม่เพียงพอ โปรดเติมเงิน');
      }
    } else {
      alert('ไม่มีธุรกรรมที่ต้องชำระเงินในขณะนี้');
    }
  };

  const handleKYCSubmission = () => {
    if (!kycData.idCardNumber || !kycData.fullName || !kycData.bankAccount) {
      alert('กรุณากรอกข้อมูลยืนยันตัวตนให้ครบถ้วน');
      return;
    }
    setUser(prev => ({...prev, verified: true}));
    setShowKYCModal(false);
    alert('ส่งข้อมูลยืนยันตัวตนเรียบร้อยแล้ว! โปรดรอการตรวจสอบจากเจ้าหน้าที่');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedTransaction) return;

    const newMessage = {
      sender: selectedTransaction.type === 'buyer' ? 'buyer' : 'seller',
      message: chatInput,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setTransactions(prev => 
      prev.map(txn => 
        txn.id === selectedTransaction.id 
          ? { ...txn, chatMessages: [...(txn.chatMessages || []), newMessage] }
          : txn
      )
    );

    setSelectedTransaction(prev => ({ ...prev, chatMessages: [...(prev.chatMessages || []), newMessage] }));
    setChatInput('');
  };

  const handleRateTransaction = () => {
    if (!newRating) {
      alert('กรุณาเลือกคะแนน');
      return;
    }
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === selectedTransaction.id
          ? { ...txn, rating: newRating }
          : txn
      )
    );
    const newTotalTransactions = user.totalTransactions + 1;
    const newAverageRating = ((user.rating * user.totalTransactions) + newRating) / newTotalTransactions;
    setUser(prev => ({
      ...prev,
      totalTransactions: newTotalTransactions,
      rating: parseFloat(newAverageRating.toFixed(1))
    }));

    setShowRatingModal(false);
    setSelectedTransaction(null);
    alert('ขอบคุณสำหรับคะแนน!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`ไฟล์ "${file.name}" ถูกอัปโหลดแล้ว`);
    }
  };

  const confirmReceived = (transactionId) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === transactionId 
          ? { ...txn, buyerConfirmed: true, status: txn.sellerConfirmed ? 'completed' : 'waiting_confirmation' }
          : txn
      )
    );
  };

  const confirmSent = (transactionId) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === transactionId 
          ? { ...txn, sellerConfirmed: true, status: txn.buyerConfirmed ? 'completed' : 'waiting_confirmation' }
          : txn
      )
    );
  };
  
  const getFilteredTransactions = () => {
    switch(transactionFilter) {
      case 'pending':
        return transactions.filter(t => t.status === 'waiting_payment' || t.status === 'waiting_confirmation');
      case 'completed':
        return transactions.filter(t => t.status === 'completed');
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const TabButton = ({ id, label, icon: Icon, active, onClick, badge }) => (
    <button
      onClick={() => onClick(id)}
      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="hidden md:inline">{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );

  const TransactionCard = ({ transaction, onViewDetails }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'waiting_payment': return 'text-orange-600 bg-orange-50';
        case 'waiting_confirmation': return 'text-yellow-600 bg-yellow-50';
        case 'completed': return 'text-green-600 bg-green-50';
        case 'dispute': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'waiting_payment': return 'รอชำระเงิน';
        case 'waiting_confirmation': return 'รอการยืนยัน';
        case 'completed': return 'สำเร็จ';
        case 'dispute': return 'มีข้อโต้แย้ง';
        default: return 'ไม่ทราบสถานะ';
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{transaction.item}</h3>
            <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{transaction.type === 'buyer' ? 'ซื้อจาก' : 'ขายให้'}: {transaction.otherParty}</span>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span>{transaction.otherPartyRating}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
            {getStatusText(transaction.status)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ฿{transaction.amount.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              (ค่าธรรมเนียม ฿{transaction.fee})
            </span>
          </div>
          <span className="text-sm text-gray-500">{transaction.created}</span>
        </div>

        {transaction.status === 'waiting_payment' && transaction.type === 'buyer' && (
          <button 
            onClick={() => {setSelectedTransaction(transaction); setShowPaymentModal(true);}}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors mb-2"
          >
            ชำระเงินเข้า Escrow
          </button>
        )}
        {transaction.status === 'waiting_payment' && transaction.type === 'seller' && (
          <button 
            onClick={() => onViewDetails(transaction)}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors mb-2"
          >
            ดูรายละเอียด
          </button>
        )}

        {transaction.status === 'waiting_confirmation' && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className={transaction.sellerConfirmed ? 'text-green-500' : 'text-gray-300'} />
                <span>ผู้ขายยืนยันแล้ว</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className={transaction.buyerConfirmed ? 'text-green-500' : 'text-gray-300'} />
                <span>ผู้ซื้อยืนยันแล้ว</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!transaction.buyerConfirmed && transaction.type === 'buyer' && (
                <button 
                  onClick={() => confirmReceived(transaction.id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  ยืนยันรับสินค้า
                </button>
              )}
              {!transaction.sellerConfirmed && transaction.type === 'seller' && (
                <button 
                  onClick={() => confirmSent(transaction.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ยืนยันส่งแล้ว
                </button>
              )}
              <button 
                onClick={() => onViewDetails(transaction)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ดูรายละเอียด
              </button>
            </div>
          </div>
        )}

        {transaction.status === 'completed' && (
          <div className="flex space-x-2">
            <button 
              onClick={() => onViewDetails(transaction)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ดูรายละเอียด
            </button>
            {!transaction.rating && (
              <button 
                onClick={() => {setSelectedTransaction(transaction); setShowRatingModal(true);}}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                ให้คะแนน
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const CreateTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">สร้างธุรกรรมใหม่</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทธุรกรรม</label>
            <select 
              value={newTransaction.type}
              onChange={(e) => setNewTransaction(prev => ({...prev, type: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="buyer">ฉันเป็นผู้ซื้อ</option>
              <option value="seller">ฉันเป็นผู้ขาย</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า/บริการ</label>
            <input 
              type="text"
              value={newTransaction.item}
              onChange={(e) => setNewTransaction(prev => ({...prev, item: e.target.value}))}
              placeholder="เช่น iPhone 14 Pro Max 256GB"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea 
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({...prev, description: e.target.value})))}
              placeholder="อธิบายรายละเอียดสินค้า สภาพ การรับประกัน"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท)</label>
            <input 
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({...prev, amount: e.target.value}))}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {newTransaction.amount && (
              <p className="text-sm text-gray-500 mt-1">
                ค่าธรรมเนียม: ฿{Math.round(parseFloat(newTransaction.amount || 0) * 0.015)} (1.5%)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newTransaction.type === 'buyer' ? 'ข้อมูลผู้ขาย' : 'ข้อมูลผู้ซื้อ'}
            </label>
            <input 
              type="text"
              value={newTransaction.otherPartyContact}
              onChange={(e) => setNewTransaction(prev => ({...prev, otherPartyContact: e.target.value}))}
              placeholder="ชื่อ, เบอร์โทร, หรือ Line ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowCreateTransaction(false)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleCreateTransaction}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            สร้างธุรกรรม
          </button>
        </div>
      </div>
    </div>
  );

  const JoinTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">เข้าร่วมธุรกรรม</h2>
          <button onClick={() => setShowJoinTransactionModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">กรุณากรอกรหัสธุรกรรมที่ได้รับจากผู้ขายเพื่อชำระเงิน</p>
        <input 
          type="text"
          value={joinTransactionId}
          onChange={(e) => setJoinTransactionId(e.target.value)}
          placeholder="เช่น TXN001"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowJoinTransactionModal(false)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleJoinTransaction}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ค้นหาและชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentModal = () => {
    if (!selectedTransaction) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">ชำระเงินเข้า Escrow</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800">{selectedTransaction.item}</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ฿{(selectedTransaction.amount + selectedTransaction.fee).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                สินค้า: ฿{selectedTransaction.amount.toLocaleString()} + 
                ค่าธรรมเนียม: ฿{selectedTransaction.fee}
              </p>
            </div>

            <div className="text-center">
              <h4 className="font-medium mb-2">สแกน QR Code เพื่อชำระเงิน</h4>
              <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white border-2 border-black mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs">QR Code</span>
                  </div>
                  <p className="text-sm text-gray-600">PromptPay</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>เลขบัญชี: 081-234-5678</p>
                <p>ชื่อบัญชี: SecureEscrow Co., Ltd.</p>
                <p className="text-red-600 font-medium">
                  โอนแล้วอย่าลืมแจ้ง!
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หลักฐานการโอน</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">อัพโหลดสลิปการโอน</p>
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="text-blue-600 text-sm mt-1">เลือกไฟล์</button>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
            <button 
              onClick={handlePaymentConfirmation}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              แจ้งชำระแล้ว
            </button>
          </div>
        </div>
      </div>
    );
  };

  const KYCModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">ยืนยันตัวตน (KYC)</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
            <input 
              type="text"
              value={kycData.idCardNumber}
              onChange={(e) => setKycData(prev => ({...prev, idCardNumber: e.target.value}))}
              placeholder="1-2345-67890-12-3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (ตามบัตรประชาชน)</label>
            <input 
              type="text"
              value={kycData.fullName}
              onChange={(e) => setKycData(prev => ({...prev, fullName: e.target.value}))}
              placeholder="นาย สมชาย ใจดี"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
            <textarea 
              value={kycData.address}
              onChange={(e) => setKycData(prev => ({...prev, address: e.target.value}))}
              placeholder="123 ถนนสุขุมวิท แขวง... เขต... จ.กรุงเทพฯ 10110"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ธนาคาร</label>
              <select 
                value={kycData.bankName}
                onChange={(e) => setKycData(prev => ({...prev, bankName: e.target.value}))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="กรุงเทพ">กรุงเทพ</option>
                <option value="กสิกรไทย">กสิกรไทย</option>
                <option value="ไทยพาณิชย์">ไทยพาณิชย์</option>
                <option value="กรุงไทย">กรุงไทย</option>
                <option value="กรุงศรีฯ">กรุงศรีอยุธยา</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัญชี</label>
              <input 
                type="text"
                value={kycData.bankAccount}
                onChange={(e) => setKycData(prev => ({...prev, bankAccount: e.target.value}))}
                placeholder="123-4-56789-0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รูปบัตรประชาชน (หน้า)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">อัพโหลดรูปบัตรประชาชน</p>
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="text-blue-600 text-sm mt-1">เลือกไฟล์</button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รูปถ่ายใบหน้าพร้อมบัตรประชาชน</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">ถือบัตรประชาชนข้างใบหน้า</p>
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="text-blue-600 text-sm mt-1">เลือกไฟล์</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowKYCModal(false)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleKYCSubmission}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ส่งข้อมูลยืนยัน
          </button>
        </div>
      </div>
    </div>
  );

  const RatingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">ให้คะแนนธุรกรรม</h2>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={36}
              className={`cursor-pointer ${star <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              onClick={() => setNewRating(star)}
            />
          ))}
        </div>
        <textarea
          value={ratingComment}
          onChange={(e) => setRatingComment(e.target.value)}
          placeholder="เขียนความคิดเห็นเพิ่มเติม (ไม่บังคับ)..."
          rows="3"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowRatingModal(false)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleRateTransaction}
            className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            ส่งคะแนน
          </button>
        </div>
      </div>
    </div>
  );

  const DisputeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">รายงานปัญหา</h2>
          <button onClick={() => setShowDisputeModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">โปรดระบุรายละเอียดของปัญหาที่คุณพบในธุรกรรม #{selectedTransaction?.id}</p>
        <textarea
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)}
          placeholder="อธิบายปัญหา เช่น 'สินค้าที่ได้รับไม่ตรงตามที่ตกลง' หรือ 'ผู้ขายไม่ยอมจัดส่งสินค้า'..."
          rows="4"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
        ></textarea>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowDisputeModal(false)}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              if (disputeReason.trim()) {
                setTransactions(prev =>
                  prev.map(txn =>
                    txn.id === selectedTransaction.id
                      ? { ...txn, status: 'dispute' }
                      : txn
                  )
                );
                setShowDisputeModal(false);
                setSelectedTransaction(null);
                setCurrentTab('disputes');
                alert('รายงานปัญหาถูกส่งแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
              } else {
                alert('กรุณาระบุเหตุผลในการรายงานปัญหา');
              }
            }}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ส่งรายงาน
          </button>
        </div>
      </div>
    </div>
  );
  
  const Dashboard = () => {
    const waitingTransactions = transactions.filter(t => t.status === 'waiting_confirmation' || t.status === 'waiting_payment');
    
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">ยอดคงเหลือ</p>
                <p className="text-2xl font-bold">฿{user.balance.toLocaleString()}</p>
              </div>
              <Wallet size={32} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">ธุรกรรมทั้งหมด</p>
                <p className="text-2xl font-bold">{user.totalTransactions}</p>
              </div>
              <TrendingUp size={32} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-bold">{user.rating}/5</p>
              </div>
              <Star size={32} className="text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">รอดำเนินการ</p>
                <p className="text-2xl font-bold">{waitingTransactions.length}</p>
              </div>
              <Clock size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">การดำเนินการด่วน</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowCreateTransaction(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus size={20} />
              <span>สร้างธุรกรรมใหม่</span>
            </button>
            
            <button 
              onClick={() => setShowKYCModal(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <User size={20} />
              <span>ยืนยันตัวตน</span>
            </button>
            
            {/* Added Wallet Payment Button */}
            <button
              onClick={handleWalletPayment}
              className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <CreditCard size={20} />
              <span>ชำระเงินด้วยกระเป๋ากลาง</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">ธุรกรรมล่าสุด</h2>
            <button 
              onClick={() => setCurrentTab('transactions')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ดูทั้งหมด →
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {transactions.slice(0, 2).map(transaction => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction} 
                onViewDetails={(txn) => setSelectedTransaction(txn)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TransactionList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">ธุรกรรมทั้งหมด</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowJoinTransactionModal(true)}
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Search size={20} />
            <span>เข้าสู่ธุรกรรมด้วยรหัส</span>
          </button>
          <button 
            onClick={() => setShowCreateTransaction(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>สร้างธุรกรรมใหม่</span>
          </button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button 
          onClick={() => setTransactionFilter('all')}
          className={`pb-2 px-1 text-sm font-medium ${transactionFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'}`}
        >
          ทั้งหมด
        </button>
        <button 
          onClick={() => setTransactionFilter('pending')}
          className={`pb-2 px-1 text-sm font-medium ${transactionFilter === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'}`}
        >
          รอดำเนินการ
        </button>
        <button 
          onClick={() => setTransactionFilter('completed')}
          className={`pb-2 px-1 text-sm font-medium ${transactionFilter === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'}`}
        >
          เสร็จสิ้น
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTransactions.map(transaction => (
          <TransactionCard 
            key={transaction.id} 
            transaction={transaction} 
            onViewDetails={(txn) => setSelectedTransaction(txn)}
          />
        ))}
      </div>
    </div>
  );

  const SecurityCenter = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ศูนย์ความปลอดภัย</h2>
      
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-medium">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Shield size={16} className="text-green-500" />
                <span className="text-sm text-green-600 font-medium">ยืนยันตัวตนแล้ว</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{user.rating}/5</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowKYCModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Shield size={24} className="text-green-500" />
            <h3 className="font-semibold text-gray-800">การยืนยันตัวตน</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm text-gray-700">บัตรประชาชน</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ยืนยันแล้ว</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm text-gray-700">เบอร์โทรศัพท์</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ยืนยันแล้ว</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm text-gray-700">อีเมล</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ยืนยันแล้ว</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm text-gray-700">บัญชีธนาคาร</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ยืนยันแล้ว</span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Lock size={24} className="text-blue-500" />
            <h3 className="font-semibold text-gray-800">การตั้งค่าความปลอดภัย</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">2FA Authentication</span>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                เปิดใช้งาน
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">การแจ้งเตือน SMS</span>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                เปิดใช้งาน
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">การตรวจจับการโกง AI</span>
              <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                เปิดใช้งาน
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">การแจ้งเตือนอีเมล</span>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                ตั้งค่า
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Eye size={24} className="text-purple-500" />
            <h3 className="font-semibold text-gray-800">กิจกรรมล่าสุด</h3>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ดูทั้งหมด →
          </button>
        </div>
        <div className="space-y-3">
          {[
            { action: 'เข้าสู่ระบบจาก Bangkok, Thailand', time: '2 นาทีที่แล้ว', icon: <User size={16} className="text-blue-500" /> },
            { action: 'ยืนยันธุรกรรม TXN001', time: '1 ชั่วโมงที่แล้ว', icon: <CheckCircle size={16} className="text-green-500" /> },
            { action: 'สร้างธุรกรรมใหม่ TXN002', time: '3 ชั่วโมงที่แล้ว', icon: <Plus size={16} className="text-purple-500" /> },
            { action: 'เปลี่ยนรหัสผ่าน', time: '3 วันที่แล้ว', icon: <Lock size={16} className="text-orange-500" /> }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                {activity.icon}
                <span className="text-sm text-gray-700">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DisputeCenter = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ศูนย์จัดการข้อโต้แย้ง</h2>
      
      <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">ไม่มีข้อโต้แย้ง</h3>
        <p className="text-gray-600 mb-6">ธุรกรรมทั้งหมดของคุณเป็นไปอย่างราบรื่น</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          เรียนรู้เพิ่มเติมเกี่ยวกับการป้องกันการโกง
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'disputes':
        return <DisputeCenter />;
      case 'security':
        return <SecurityCenter />;
      default:
        return <Dashboard />;
    }
  };

  const waitingCount = transactions.filter(t => 
    t.status === 'waiting_confirmation' || t.status === 'waiting_payment'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">SecureEscrow</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <AlertTriangle size={20} />
                {waitingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {waitingCount}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600">ยืนยันตัวตนแล้ว</span>
                    <div className="flex items-center space-x-1">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{user.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <nav className="space-y-2">
                <TabButton 
                  id="dashboard" 
                  label="แดชบอร์ด" 
                  icon={TrendingUp} 
                  active={currentTab === 'dashboard'} 
                  onClick={setCurrentTab} 
                />
                <TabButton 
                  id="transactions" 
                  label="ธุรกรรม" 
                  icon={FileText} 
                  active={currentTab === 'transactions'} 
                  onClick={setCurrentTab}
                  badge={waitingCount}
                />
                <TabButton 
                  id="disputes" 
                  label="ข้อโต้แย้ง" 
                  icon={AlertTriangle} 
                  active={currentTab === 'disputes'} 
                  onClick={setCurrentTab} 
                />
                <TabButton 
                  id="security" 
                  label="ความปลอดภัย" 
                  icon={Shield} 
                  active={currentTab === 'security'} 
                  onClick={setCurrentTab} 
                />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateTransaction && <CreateTransactionModal />}
      {showKYCModal && <KYCModal />}
      {showPaymentModal && <PaymentModal />}
      {showJoinTransactionModal && <JoinTransactionModal />}
      {selectedTransaction && !showRatingModal && !showDisputeModal && 
        <TransactionDetailModal 
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          setShowDisputeModal={setShowDisputeModal}
        />
      }
      {showRatingModal && <RatingModal />}
      {showDisputeModal && <DisputeModal />}
    </div>
  );
};

export default SecureEscrowApp;