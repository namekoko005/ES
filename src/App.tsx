import React, { useState, useEffect } from 'react';
import { Shield, Users, Wallet, CheckCircle, AlertTriangle, MessageSquare, Star, Clock, TrendingUp, Lock, Eye, FileText, Plus, Send, Camera, CreditCard, Phone, Mail, MapPin, User, X, Search, Icon as LucideIcon } from 'lucide-react';

// Interfaces for data models
interface ChatMessage {
  sender: 'buyer' | 'seller';
  message: string;
  time: string;
}

interface Transaction {
  id: string;
  type: 'buyer' | 'seller';
  item: string;
  description: string;
  amount: number;
  fee: number;
  status: 'waiting_payment' | 'waiting_confirmation' | 'completed' | 'dispute';
  otherParty: string;
  otherPartyId: string;
  otherPartyRating: string | number;
  created: string;
  completed?: string;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  trackingNumber?: string;
  escrowId: string;
  rating?: number;
  chatMessages: ChatMessage[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  rating: number;
  totalTransactions: number;
  balance: number;
  joinDate: string;
}

interface NewTransaction {
  type: 'buyer' | 'seller';
  item: string;
  description: string;
  amount: string;
  otherPartyContact: string;
  category: string;
}

interface KycData {
  idCardNumber: string;
  fullName: string;
  address: string;
  bankAccount: string;
  bankName: string;
}

interface TransactionDetailModalProps {
  selectedTransaction: Transaction;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendMessage: () => void;
  setShowDisputeModal: (show: boolean) => void;
  setShowRatingModal: (show: boolean) => void;
  onPayFromWallet: () => void; // Added prop
  onReleaseFunds: () => void; // Added prop
  isCurrentUserSeller: boolean;
}

interface TransactionCardProps {
  transaction: Transaction;
  onViewDetails: (transaction: Transaction) => void;
}

interface TabButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: (id: string) => void;
  badge: number;
}

// Separate component to handle a file input change
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const file = e.target.files?.[0];
  if (file) {
    alert(`ไฟล์ "${file.name}" ถูกอัปโหลดแล้ว`);
  }
};

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ 
  selectedTransaction, 
  setSelectedTransaction,
  chatInput,
  setChatInput,
  handleSendMessage,
  setShowDisputeModal,
  setShowRatingModal,
  onPayFromWallet,
  onReleaseFunds,
  isCurrentUserSeller
}) => {
  if (!selectedTransaction) return null;

  const isBuyer = selectedTransaction.type === 'buyer';
  const isSeller = selectedTransaction.type === 'seller';
  const isPendingPayment = selectedTransaction.status === 'waiting_payment';
  const isReadyToRelease = isSeller && selectedTransaction.buyerConfirmed && !selectedTransaction.completed;

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

          {/* New Payment Section */}
          {isPendingPayment && isBuyer && (
              <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">ตัวเลือกการชำระเงิน</h3>
                  <div className="flex space-x-3">
                      <button
                          onClick={onPayFromWallet}
                          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                          <Wallet className="inline-block mr-2" size={20} /> ชำระจากกระเป๋ากลาง
                      </button>
                      <button
                          onClick={() => { setSelectedTransaction(selectedTransaction); }} // Re-use the existing payment modal trigger
                          className="flex-1 py-3 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                          <CreditCard className="inline-block mr-2" size={20} /> ช่องทางอื่น
                      </button>
                  </div>
              </div>
          )}

          {/* New Release Funds Section for Seller */}
          {isReadyToRelease && isCurrentUserSeller && (
              <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2">การดำเนินการ</h3>
                  <p className="text-sm text-gray-700 mb-3">ผู้ซื้อยืนยันการรับสินค้าเรียบร้อยแล้ว ท่านสามารถปล่อยเงินจากระบบ Escrow ได้ทันที</p>
                  <button
                      onClick={onReleaseFunds}
                      className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                      <CreditCard className="inline-block mr-2" size={20} /> ปล่อยเงินให้ผู้ขาย
                  </button>
              </div>
          )}

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSendMessage()}
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
                onClick={() => setShowRatingModal(true)}
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

const SecureEscrowApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showJoinTransactionModal, setShowJoinTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newRating, setNewRating] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [joinTransactionId, setJoinTransactionId] = useState<string>('');

  const [user, setUser] = useState<User>({
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

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'buyer',
      item: 'iPhone 14 Pro Max 256GB สีม่วง',
      description: 'มือสอง ใช้งาน 6 เดือน สภาพดีมาก มีกล่อง',
      amount: 42000,
      fee: 630,
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

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: 'buyer',
    item: '',
    description: '',
    amount: '',
    otherPartyContact: '',
    category: 'electronics'
  });

  const [kycData, setKycData] = useState<KycData>({
    idCardNumber: '',
    fullName: '',
    address: '',
    bankAccount: '',
    bankName: 'กรุงเทพ'
  });

  const handleCreateTransaction = (): void => {
    if (!newTransaction.item || !newTransaction.amount || !newTransaction.otherPartyContact) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const fee = Math.round(parseFloat(newTransaction.amount) * 0.015);
    const transactionId = `TXN${String(transactions.length + 1).padStart(3, '0')}`;
    
    const transaction: Transaction = {
      id: transactionId,
      type: newTransaction.type as 'buyer' | 'seller',
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
  
  const handleJoinTransaction = (): void => {
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

  const handlePaymentConfirmation = (): void => {
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

  const handleWalletPayment = (): void => {
    if (!selectedTransaction || selectedTransaction.type !== 'buyer') {
      alert('ฟังก์ชันนี้ใช้ได้เฉพาะกับธุรกรรมที่คุณเป็นผู้ซื้อเท่านั้น');
      return;
    }
    
    const totalAmount = selectedTransaction.amount + selectedTransaction.fee;
    if (user.balance >= totalAmount) {
      setTransactions(prev => prev.map(txn => 
        txn.id === selectedTransaction.id ? { ...txn, status: 'waiting_confirmation' } : txn
      ));
      setUser(prev => ({
        ...prev,
        balance: prev.balance - totalAmount
      }));
      setShowPaymentModal(false);
      setSelectedTransaction(prev => prev ? ({ ...prev, status: 'waiting_confirmation' }) : null);
      alert(`ชำระเงิน ฿${totalAmount.toLocaleString()} จากกระเป๋ากลางสำเร็จ! ธุรกรรม ${selectedTransaction.id} กำลังดำเนินการ`);
    } else {
      alert('ยอดเงินในกระเป๋ากลางไม่เพียงพอ โปรดเติมเงิน');
    }
  };

  const handleReleaseFunds = (): void => {
      if (!selectedTransaction) return;
      const transactionId = selectedTransaction.id;

      setTransactions(prev => 
        prev.map(txn => 
          txn.id === transactionId && txn.sellerConfirmed && txn.buyerConfirmed
            ? { ...txn, status: 'completed', completed: new Date().toISOString().split('T')[0] }
            : txn
        )
      );
      setSelectedTransaction(prev => prev ? ({ ...prev, status: 'completed', completed: new Date().toISOString().split('T')[0] }) : null);
      alert('ปล่อยเงินให้ผู้ขายเรียบร้อยแล้ว');
  };

  const handleKYCSubmission = (): void => {
    if (!kycData.idCardNumber || !kycData.fullName || !kycData.bankAccount) {
      alert('กรุณากรอกข้อมูลยืนยันตัวตนให้ครบถ้วน');
      return;
    }
    setUser(prev => ({...prev, verified: true}));
    setShowKYCModal(false);
    alert('ส่งข้อมูลยืนยันตัวตนเรียบร้อยแล้ว! โปรดรอการตรวจสอบจากเจ้าหน้าที่');
  };

  const handleSendMessage = (): void => {
    if (!chatInput.trim() || !selectedTransaction) return;

    const newMessage: ChatMessage = {
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

    setSelectedTransaction(prev => (prev ? { ...prev, chatMessages: [...(prev.chatMessages || []), newMessage] } : null));
    setChatInput('');
  };

  const handleRateTransaction = (): void => {
    if (!newRating || !selectedTransaction) {
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

  const confirmReceived = (transactionId: string): void => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === transactionId 
          ? { ...txn, buyerConfirmed: true, status: txn.sellerConfirmed ? 'completed' : 'waiting_confirmation' }
          : txn
      )
    );
  };

  const confirmSent = (transactionId: string): void => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === transactionId 
          ? { ...txn, sellerConfirmed: true, status: txn.buyerConfirmed ? 'completed' : 'waiting_confirmation' }
          : txn
      )
    );
  };
  
  const handleDisputeSubmission = (): void => {
    if (!disputeReason.trim() || !selectedTransaction) {
      alert('กรุณาระบุเหตุผลในการรายงานปัญหา');
      return;
    }
    
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
  };
  
  const getFilteredTransactions = (): Transaction[] => {
    switch(transactionFilter) {
      case 'pending':
        return transactions.filter(t => t.status === 'waiting_payment' || t.status === 'waiting_confirmation');
      case 'completed':
        return transactions.filter(t => t.status === 'completed');
      case 'disputes':
        return transactions.filter(t => t.status === 'dispute');
      default:
        return transactions;
    }
  };

  const filteredTransactions: Transaction[] = getFilteredTransactions();

  const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, active, onClick, badge }) => (
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

  const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onViewDetails }) => {
    const getStatusColor = (status: string): string => {
      switch (status) {
        case 'waiting_payment': return 'text-orange-600 bg-orange-50';
        case 'waiting_confirmation': return 'text-yellow-600 bg-yellow-50';
        case 'completed': return 'text-green-600 bg-green-50';
        case 'dispute': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusText = (status: string): string => {
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
            onClick={() => {setSelectedTransaction(transaction);}}
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

  const CreateTransactionModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">สร้างธุรกรรมใหม่</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทธุรกรรม</label>
            <select 
              value={newTransaction.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTransaction(prev => ({...prev, type: e.target.value}))}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction(prev => ({...prev, item: e.target.value}))}
              placeholder="เช่น iPhone 14 Pro Max 256GB"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea 
              value={newTransaction.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTransaction(prev => ({...prev, description: e.target.value}))}
              placeholder="อธิบายรายละเอียดสินค้า สภาพ การรับประกัน"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (บาท)</label>
            <input 
              type="number"
              value={newTransaction.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction(prev => ({...prev, amount: e.target.value}))}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {newTransaction.amount && (
              <p className="text-sm text-gray-500 mt-1">
                ค่าธรรมเนียม: ฿{Math.round(parseFloat(newTransaction.amount || '0') * 0.015)} (1.5%)
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTransaction(prev => ({...prev, otherPartyContact: e.target.value}))}
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

  const JoinTransactionModal: React.FC = () => (
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinTransactionId(e.target.value)}
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

  const PaymentModal: React.FC = () => {
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
                สินค้า: ฿{selectedTransaction.amount.toLocaleString()} + ค่าธรรมเนียม: ฿{selectedTransaction.fee} 
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
            <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" >
              ปิด
            </button>
            <button onClick={handlePaymentConfirmation} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" >
              แจ้งชำระแล้ว
            </button>
          </div>
        </div>
      </div>
    );
  };

  const KYCModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">ยืนยันตัวตน (KYC)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
            <input type="text" value={kycData.idCardNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKycData(prev => ({...prev, idCardNumber: e.target.value}))} placeholder="1-2345-67890-12-3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (ตามบัตรประชาชน)</label>
            <input type="text" value={kycData.fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKycData(prev => ({...prev, fullName: e.target.value}))} placeholder="นาย สมชาย ใจดี" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
            <textarea value={kycData.address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKycData(prev => ({...prev, address: e.target.value}))} placeholder="123 ถนนสุขุมวิท แขวง... เขต... จ.กรุงเทพฯ 10110" rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ธนาคาร</label>
              <select value={kycData.bankName} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKycData(prev => ({...prev, bankName: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" >
                <option value="กรุงเทพ">กรุงเทพ</option>
                <option value="กสิกรไทย">กสิกรไทย</option>
                <option value="ไทยพาณิชย์">ไทยพาณิชย์</option>
                <option value="กรุงไทย">กรุงไทย</option>
                <option value="กรุงศรีฯ">กรุงศรีอยุธยา</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัญชี</label>
              <input type="text" value={kycData.bankAccount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKycData(prev => ({...prev, bankAccount: e.target.value}))} placeholder="123-4-56789-0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
          <button onClick={() => setShowKYCModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" >
            ยกเลิก
          </button>
          <button onClick={handleKYCSubmission} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" >
            ส่งข้อมูลยืนยัน
          </button>
        </div>
      </div>
    </div>
  );

  const RatingModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">ให้คะแนนธุรกรรม</h2>
        <p className="text-sm text-gray-600 mb-4">
          กรุณาให้คะแนนประสบการณ์กับ {selectedTransaction?.otherParty}
        </p>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={32}
              onClick={() => setNewRating(star)}
              className={`cursor-pointer ${
                newRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <textarea
          value={ratingComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRatingComment(e.target.value)}
          placeholder="เขียนความคิดเห็นเพิ่มเติม (ไม่บังคับ)"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              setShowRatingModal(false);
              setNewRating(0);
              setRatingComment('');
            }}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleRateTransaction}
            className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            ส่งคะแนน
          </button>
        </div>
      </div>
    </div>
  );

  const DisputeModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">รายงานปัญหา</h2>
        <p className="text-sm text-gray-600 mb-4">
          โปรดอธิบายปัญหาที่เกิดขึ้นกับธุรกรรมนี้โดยละเอียด
        </p>
        <textarea
          value={disputeReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDisputeReason(e.target.value)}
          placeholder="รายละเอียดปัญหา..."
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              setShowDisputeModal(false);
              setDisputeReason('');
            }}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDisputeSubmission}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ส่งรายงาน
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">แดชบอร์ด</h1>
            
            {/* User Info & Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <User size={28} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">ชื่อผู้ใช้</p>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Wallet size={28} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">ยอดเงินในกระเป๋า</p>
                    <h3 className="font-semibold text-gray-800">฿{user.balance.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Star size={28} className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">คะแนนเฉลี่ย</p>
                    <h3 className="font-semibold text-gray-800">{user.rating} ({user.totalTransactions} ธุรกรรม)</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Lock size={28} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">สถานะ KYC</p>
                    <h3 className="font-semibold text-gray-800">
                      {user.verified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-4">
              <h2 className="text-xl font-bold">ดำเนินการด่วน</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreateTransaction(true)}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="inline-block mr-2" /> สร้างธุรกรรมใหม่
                </button>
                <button
                  onClick={() => setShowJoinTransactionModal(true)}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText size={20} className="inline-block mr-2" /> เข้าร่วมธุรกรรม
                </button>
                <button
                  onClick={() => alert('ฟีเจอร์นี้กำลังจะมา')}
                  className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Wallet size={20} className="inline-block mr-2" /> เติมเงินเข้ากระเป๋า
                </button>
                <button
                  onClick={() => setShowKYCModal(true)}
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${
                    user.verified ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                  disabled={user.verified}
                >
                  <Lock size={20} className="inline-block mr-2" /> ยืนยันตัวตน KYC
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">ธุรกรรมล่าสุด</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactions.slice(0, 2).map((txn, index) => (
                  <TransactionCard key={index} transaction={txn} onViewDetails={setSelectedTransaction} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6 p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">ธุรกรรมของฉัน</h1>
            
            {/* Filter */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setTransactionFilter('all')}
                className={`py-2 px-4 rounded-full text-sm font-medium ${transactionFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                ทั้งหมด
              </button>
              <button 
                onClick={() => setTransactionFilter('pending')}
                className={`py-2 px-4 rounded-full text-sm font-medium ${transactionFilter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                รอการดำเนินการ
              </button>
              <button 
                onClick={() => setTransactionFilter('completed')}
                className={`py-2 px-4 rounded-full text-sm font-medium ${transactionFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                เสร็จสิ้น
              </button>
              <button 
                onClick={() => setTransactionFilter('disputes')}
                className={`py-2 px-4 rounded-full text-sm font-medium ${transactionFilter === 'disputes' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                มีปัญหา
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {filteredTransactions.map((txn) => (
                <TransactionCard key={txn.id} transaction={txn} onViewDetails={setSelectedTransaction} />
              ))}
              {filteredTransactions.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  <p>ไม่พบธุรกรรมในสถานะนี้</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'disputes':
        return (
          <div className="space-y-6 p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">รายการข้อโต้แย้ง</h1>
            <p className="text-gray-600">หากคุณมีปัญหาเกี่ยวกับธุรกรรม โปรดรายงานปัญหาเพื่อขอความช่วยเหลือ</p>
            <button
              onClick={() => {
                const pendingDisputes = transactions.filter(t => t.status !== 'completed' && t.status !== 'dispute');
                if (pendingDisputes.length > 0) {
                  setSelectedTransaction(pendingDisputes[0]);
                  setShowDisputeModal(true);
                } else {
                  alert('ไม่มีธุรกรรมที่สามารถรายงานปัญหาได้ในขณะนี้');
                }
              }}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <AlertTriangle size={20} className="inline-block mr-2" /> รายงานปัญหาใหม่
            </button>
            <div className="space-y-4">
              {transactions.filter(t => t.status === 'dispute').map((txn) => (
                <TransactionCard key={txn.id} transaction={txn} onViewDetails={setSelectedTransaction} />
              ))}
              {transactions.filter(t => t.status === 'dispute').length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  <p>ไม่พบข้อโต้แย้งที่อยู่ระหว่างการดำเนินการ</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">ความปลอดภัยและ KYC</h1>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-4">
              <h2 className="text-xl font-bold">ยืนยันตัวตน (KYC)</h2>
              <p className="text-gray-600">
                การยืนยันตัวตนช่วยเพิ่มความน่าเชื่อถือให้กับบัญชีของคุณและปลดล็อกวงเงินการทำธุรกรรมที่สูงขึ้น
              </p>
              <div className="flex items-center space-x-2">
                <Lock size={24} className={user.verified ? 'text-green-600' : 'text-gray-400'} />
                <span className={`font-medium ${user.verified ? 'text-green-600' : 'text-gray-600'}`}>
                  สถานะ: {user.verified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                </span>
              </div>
              {!user.verified && (
                <button
                  onClick={() => setShowKYCModal(true)}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ดำเนินการยืนยันตัวตน
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <div className="bg-white shadow-lg lg:w-64 p-4 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-8">
              Secure<span className="text-gray-800">Escrow</span>
            </div>
            <nav className="space-y-2">
              <TabButton 
                id="dashboard" 
                label="แดชบอร์ด" 
                icon={TrendingUp} 
                active={currentTab === 'dashboard'} 
                onClick={setCurrentTab} 
                badge={0}
              />
              <TabButton 
                id="transactions" 
                label="ธุรกรรม" 
                icon={Clock} 
                active={currentTab === 'transactions'} 
                onClick={setCurrentTab} 
                badge={transactions.filter(t => t.status === 'waiting_confirmation').length}
              />
              <TabButton 
                id="disputes" 
                label="ข้อโต้แย้ง" 
                icon={AlertTriangle} 
                active={currentTab === 'disputes'} 
                onClick={setCurrentTab} 
                badge={transactions.filter(t => t.status === 'dispute').length}
              />
              <TabButton 
                id="security" 
                label="ความปลอดภัย" 
                icon={Shield} 
                active={currentTab === 'security'} 
                onClick={setCurrentTab} 
                badge={0}
              />
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
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
          setShowRatingModal={setShowRatingModal}
          onPayFromWallet={handleWalletPayment}
          onReleaseFunds={handleReleaseFunds}
          isCurrentUserSeller={user.id === selectedTransaction.otherPartyId} // This is a placeholder for the current user's role
        />
      }
      {showRatingModal && <RatingModal />}
      {showDisputeModal && <DisputeModal />}
    </div>
  );
};

export default SecureEscrowApp;