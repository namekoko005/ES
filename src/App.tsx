import { useState } from 'react';
import { Shield, Wallet, CheckCircle, AlertTriangle, Star, Clock, TrendingUp, Lock, Eye, FileText } from 'lucide-react';

// Interfaces for better type safety
interface Transaction {
  id: string;
  type: 'buyer' | 'seller';
  item: string;
  amount: number;
  status: 'waiting_confirmation' | 'completed' | 'dispute';
  otherParty: string;
  created: string;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
}

interface Dispute {
  id: string;
  transactionId: string;
  issue: string;
  status: 'investigating';
  created: string;
}

interface User {
  name: string;
  verified: boolean;
  rating: number;
  totalTransactions: number;
  balance: number;
}

// === Components
// TabButton Component
interface TabButtonProps {
  id: string;
  label: string;
  icon: any; // Using `any` for the icon component for simplicity
  active: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="hidden md:inline">{label}</span>
  </button>
);

// TransactionCard Component
interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'waiting_confirmation': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'dispute': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'waiting_confirmation': return 'รอการยืนยัน';
      case 'completed': return 'สำเร็จ';
      case 'dispute': return 'มีข้อโต้แย้ง';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{transaction.item}</h3>
          <p className="text-sm text-gray-500">
            {transaction.type === 'buyer' ? 'ซื้อจาก' : 'ขายให้'}: {transaction.otherParty}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
          {getStatusText(transaction.status)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-green-600">
          ฿{transaction.amount.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">{transaction.created}</span>
      </div>

      {transaction.status === 'waiting_confirmation' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-2">
              <CheckCircle size={16} className={transaction.sellerConfirmed ? 'text-green-500' : 'text-gray-300'} />
              <span>ผู้ขายยืนยันแล้ว</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-2">
              <CheckCircle size={16} className={transaction.buyerConfirmed ? 'text-green-500' : 'text-gray-300'} />
              <span>ผู้ซื้อยืนยันแล้ว</span>
            </span>
          </div>
          {!transaction.buyerConfirmed && transaction.type === 'buyer' && (
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
              ยืนยันรับสินค้า
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Dashboard Component
interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => (
  <div className="space-y-6">
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
            <p className="text-purple-100">รอยืนยัน</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <Clock size={32} className="text-purple-200" />
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ธุรกรรมล่าสุด</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {transactions.slice(0, 2).map(transaction => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  </div>
);

// TransactionList Component
interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">ธุรกรรมทั้งหมด</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        สร้างธุรกรรมใหม่
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {transactions.map(transaction => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  </div>
);

// DisputeCenter Component
interface DisputeCenterProps {
  disputes: Dispute[];
}

const DisputeCenter: React.FC<DisputeCenterProps> = ({ disputes }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">ศูนย์จัดการข้อโต้แย้ง</h2>
    {disputes.length > 0 ? (
      <div className="space-y-4">
        {disputes.map(dispute => (
          <div key={dispute.id} className="bg-white p-6 rounded-xl border border-red-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">ข้อโต้แย้ง #{dispute.id}</h3>
                <p className="text-sm text-gray-600">ธุรกรรม: {dispute.transactionId}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                กำลังตรวจสอบ
              </span>
            </div>
            <p className="text-gray-700 mb-4">{dispute.issue}</p>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ดูรายละเอียด
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                อัพโหลดหลักฐาน
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">ไม่มีข้อโต้แย้ง</h3>
        <p className="text-gray-600">ธุรกรรมทั้งหมดของคุณเป็นไปอย่างราบรื่น</p>
      </div>
    )}
  </div>
);

// SecurityCenter Component
const SecurityCenter = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">ศูนย์ความปลอดภัย</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Shield size={24} className="text-green-500" />
          <h3 className="font-semibold text-gray-800">การยืนยันตัวตน</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">บัตรประชาชน</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">เบอร์โทรศัพท์</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">อีเมล</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">บัญชีธนาคาร</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Lock size={24} className="text-blue-500" />
          <h3 className="font-semibold text-gray-800">การตั้งค่าความปลอดภัย</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">2FA Authentication</span>
            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              เปิดใช้งาน
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">การแจ้งเตือน SMS</span>
            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              เปิดใช้งาน
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">การตรวจจับการโกง AI</span>
            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              เปิดใช้งาน
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <Eye size={24} className="text-purple-500" />
        <h3 className="font-semibold text-gray-800">กิจกรรมล่าสุด</h3>
      </div>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>เข้าสู่ระบบจาก Bangkok, Thailand</span>
          <span>2 นาทีที่แล้ว</span>
        </div>
        <div className="flex justify-between">
          <span>ยืนยันธุรกรรม TXN001</span>
          <span>1 ชั่วโมงที่แล้ว</span>
        </div>
        <div className="flex justify-between">
          <span>เปลี่ยนรหัสผ่าน</span>
          <span>3 วันที่แล้ว</span>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
const SecureEscrowApp = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user] = useState<User>({
    name: 'สมชาย ใจดี',
    verified: true,
    rating: 4.8,
    totalTransactions: 47,
    balance: 15420
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'buyer',
      item: 'iPhone 14 Pro Max 256GB',
      amount: 42000,
      status: 'waiting_confirmation',
      otherParty: 'ร้านมือถือโปร',
      created: '2025-08-15',
      buyerConfirmed: false,
      sellerConfirmed: true
    },
    {
      id: 'TXN002',
      type: 'seller',
      item: 'MacBook Air M2',
      amount: 35000,
      status: 'completed',
      otherParty: 'คุณสมหญิง',
      created: '2025-08-10',
      buyerConfirmed: true,
      sellerConfirmed: true
    }
  ]);

  const [disputes] = useState<Dispute[]>([
    {
      id: 'DIS001',
      transactionId: 'TXN003',
      issue: 'สินค้าไม่ตรงตามรูป',
      status: 'investigating',
      created: '2025-08-12'
    }
  ]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard user={user} transactions={transactions} />;
      case 'transactions':
        return <TransactionList transactions={transactions} />;
      case 'disputes':
        return <DisputeCenter disputes={disputes} />;
      case 'security':
        return <SecurityCenter />;
      default:
        return <Dashboard user={user} transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">SecureEscrow</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">ส</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">ยืนยันตัวตนแล้ว ✓</p>
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
            <div className="bg-white rounded-xl p-6 border border-gray-200">
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
    </div>
  );
};

export default SecureEscrowApp;