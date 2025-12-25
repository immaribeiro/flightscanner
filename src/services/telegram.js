import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Telegram notification service for flight deals
 */
export class TelegramNotifier {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!this.botToken || !this.chatId) {
      console.warn('⚠️  Telegram credentials not configured. Notifications disabled.');
      this.enabled = false;
      return;
    }
    
    this.bot = new TelegramBot(this.botToken, { polling: false });
    this.enabled = true;
    console.log('✅ Telegram notifier initialized');
  }

  async sendFlightAlert(flightData) {
    if (!this.enabled) {
      console.log('📱 Telegram disabled - would have sent:', flightData.summary);
      return;
    }

    try {
      const message = this.formatFlightMessage(flightData);
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
      console.log('✅ Telegram notification sent');
      return true;
    } catch (error) {
      console.error('❌ Failed to send Telegram notification:', error.message);
      return false;
    }
  }

  formatFlightMessage(flight) {
    const { outbound, return: ret, totalPrice, currency, flexibility, savings, link, provider } = flight;
    
    let message = `🎉 *Great Flight Deal Found!*\n\n`;
    message += `💰 *Total Price:* ${currency} €${totalPrice}\n`;
    
    if (savings) {
      message += `💵 *Savings:* ${savings}\n`;
    }
    
    if (flexibility && flexibility !== 'EXACT_DATES') {
      message += `📅 *Flexibility:* ${flexibility}\n`;
    }
    
    message += `\n✈️ *Outbound Flight*\n`;
    message += `📅 ${outbound.date}\n`;
    message += `🛫 ${outbound.airline} ${outbound.flightNumber || ''}\n`;
    message += `${outbound.departureAirport} → ${outbound.arrivalAirport}\n`;
    message += `⏱ ${Math.floor(outbound.duration / 60)}h ${outbound.duration % 60}m\n`;
    message += `🔄 ${outbound.stops === 0 ? 'Direct' : outbound.stops + ' stop(s)'}\n`;
    
    if (outbound.layovers && outbound.layovers.length > 0) {
      message += `📍 via ${outbound.layovers.join(', ')}\n`;
    }
    
    message += `\n🔙 *Return Flight*\n`;
    message += `📅 ${ret.date}\n`;
    message += `🛫 ${ret.airline} ${ret.flightNumber || ''}\n`;
    message += `${ret.departureAirport} → ${ret.arrivalAirport}\n`;
    message += `⏱ ${Math.floor(ret.duration / 60)}h ${ret.duration % 60}m\n`;
    message += `🔄 ${ret.stops === 0 ? 'Direct' : ret.stops + ' stop(s)'}\n`;
    
    if (ret.layovers && ret.layovers.length > 0) {
      message += `📍 via ${ret.layovers.join(', ')}\n`;
    }
    
    if (link) {
      message += `\n🔗 [Book on ${provider || 'Website'}](${link})`;
    }
    
    message += `\n\n_Scanned at ${new Date().toLocaleString()}_`;
    
    return message;
  }

  async sendStatusUpdate(message) {
    if (!this.enabled) {
      console.log('📱 Status:', message);
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, `ℹ️ ${message}`);
    } catch (error) {
      console.error('Failed to send status update:', error.message);
    }
  }

  async sendError(errorMessage) {
    if (!this.enabled) {
      console.log('❌ Error:', errorMessage);
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, `⚠️ *Error*: ${errorMessage}`, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Failed to send error notification:', error.message);
    }
  }
}
