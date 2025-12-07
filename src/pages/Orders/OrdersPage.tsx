import { Card, Typography, Button } from 'antd'
import './OrdersPage.css'

const { Title, Text } = Typography

const OrdersPage: React.FC = () => {
  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={3} className="cart-title">
          Корзина
        </Title>
      </div>

      <div className="cart-list">
        {/* WHYCOOK */}
        <Card className="cart-partner-card" variant="borderless">
          <div className="cart-partner-header">
            <div className="cart-partner-logo">
              <img src="/src/Resources/Images/Frame 20 (1).png" alt="WHYCOOK" />
            </div>
            <div className="cart-partner-name">WHYCOOK</div>
          </div>

          <div className="cart-item">
            <div className="cart-item-image">
              <img src="/src/Resources/Images/Frame 20 (1).png" alt="Курица по-тайски" />
              <span className="cart-discount-pill">-30 %</span>
            </div>
            <div className="cart-item-body">
              <Text className="cart-item-title">Курица по-тайски 300 г</Text>
              <Text className="cart-item-desc">
                Куриное крыло, мука пшеничная высший сорт, рис, сливки, специи.
              </Text>
              <div className="cart-item-footer">
                <div className="cart-price-line">
                  <span className="cart-old-price">250 сом</span>
                  <span className="cart-main-price">
                    200 сом + 58 Yess!Coins
                  </span>
                </div>
                <div className="cart-qty">
                  <button type="button" className="cart-qty-btn">-</button>
                  <span className="cart-qty-value">1</span>
                  <button type="button" className="cart-qty-btn">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-partner-total">
            Итого : 200 сом + 58 Yess!Coins
          </div>

          <div className="cart-partner-actions">
            <Button type="primary" className="cart-go-order-btn">
              Перейти к заказу
            </Button>
            <div className="cart-discount-info">Скидка 35 %</div>
          </div>
        </Card>

        {/* TECHFIRE */}
        <Card className="cart-partner-card" variant="borderless">
          <div className="cart-partner-header">
            <div className="cart-partner-logo">
              <img src="/src/Resources/Images/appicon_images.png" alt="TECHFIRE" />
            </div>
            <div className="cart-partner-name">TECHFIRE</div>
          </div>

          <div className="cart-item">
            <div className="cart-item-image">
              <img src="/src/Resources/Images/image 183.png" alt="iPhone 17 Pro" />
              <span className="cart-discount-pill">-30 %</span>
            </div>
            <div className="cart-item-body">
              <Text className="cart-item-title">Apple iPhone 17 Pro 256GB</Text>
              <Text className="cart-item-desc">
                Экран 6.3&quot; OLED ProMotion • Камера 48 МП Pro+ UltraWide + Telephoto • Чип A18 Pro
              </Text>
              <div className="cart-item-footer">
                <div className="cart-price-line">
                  <span className="cart-old-price">160 000 сом</span>
                  <span className="cart-main-price">
                    130 000 сом + 30 000 Yess!Coins
                  </span>
                </div>
                <div className="cart-qty">
                  <button type="button" className="cart-qty-btn">-</button>
                  <span className="cart-qty-value">1</span>
                  <button type="button" className="cart-qty-btn">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-partner-total">
            Итого : 130 000 сом + 30 000 Yess!Coins
          </div>

          <div className="cart-partner-actions">
            <Button type="primary" className="cart-go-order-btn">
              Перейти к заказу
            </Button>
            <div className="cart-discount-info">Скидка 35 %</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrdersPage

